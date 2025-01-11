import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import "./SpaceXLaunches.scss";
import "./App.css";
import LaunchCard from "./components/LaunchCard";
import LaunchError from "./components/LaunchError";
import Spinner from "./components/Spinner";
import LaunchSearch from "./components/LaunchSearch";

const PAGE_SIZE = 10;

const fetchLaunchesPage = async ({ pageParam = 0 }) => {
    const response = await fetch(
        `https://api.spacexdata.com/v3/launches?limit=${PAGE_SIZE}&offset=${
            pageParam * PAGE_SIZE
        }&order=desc`
    );
    const data = await response.json();
    return {
        data,
        nextPage: data.length === PAGE_SIZE ? pageParam + 1 : undefined,
    };
};

function App() {
    const [searchQuery, setSearchQuery] = useState("");
    const loaderRef = useRef(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ["launches"],
        queryFn: fetchLaunchesPage,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (
                    first.isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allLaunches = data?.pages.flatMap((page) => page.data) ?? [];
    const filteredLaunches = allLaunches.filter(
        (launch) =>
            launch.mission_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            launch.rocket.rocket_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    if (isError) {
        return <LaunchError error={error} />;
    }

    return (
        <div className="app-container">
            <div className="content-wrapper">
                <header className="header">
                    <h1>SpaceX Launches</h1>
                    <LaunchSearch
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </header>

                {isLoading ? (
                    <Spinner />
                ) : (
                    <div className="launches-list">
                        {filteredLaunches.map((launch, index) => (
                            <LaunchCard launch={launch} key={index} />
                        ))}

                        {hasNextPage && (
                            <div ref={loaderRef} className="loading-more">
                                <div className="loader"></div>
                            </div>
                        )}

                        {!hasNextPage && allLaunches.length > 0 && (
                            <div className="no-more-data">
                                No more launches to load
                            </div>
                        )}

                        {filteredLaunches.length === 0 && !isLoading && (
                            <div className="no-results">
                                No launches found matching your search
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
