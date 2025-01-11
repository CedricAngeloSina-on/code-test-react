import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import "./launchcard.scss";

const LaunchCard = ({ launch }) => {
    // State to track whether details are shown
    const [showDetails, setShowDetails] = useState(false);

    // Toggle details visibility
    const toggleDetails = () => {
        setShowDetails((prev) => !prev);
    };

    const launchDate = new Date(launch.launch_date_utc);
    const formattedDate = formatDistanceToNow(launchDate, { addSuffix: true });

    return (
        <div className="launch-card">
            <div className="launch-header">
                <div>
                    <h2>{launch.mission_name}</h2>
                    <p className="rocket-name">
                        Rocket: {launch.rocket.rocket_name}
                    </p>
                </div>
                {/* Render status (Upcoming, Success, Failed) */}
                <div
                    className={`launch-status ${
                        launch.upcoming
                            ? "upcoming"
                            : launch.launch_success
                            ? "success"
                            : "failed"
                    }`}
                >
                    {launch.upcoming
                        ? "Upcoming"
                        : launch.launch_success
                        ? "Success"
                        : "Failed"}
                </div>
            </div>
            {/* Button to toggle details */}
            <button className="launch-button-details" onClick={toggleDetails}>
                {showDetails ? "Hide Details" : "Show Details"}
            </button>

            {/* Conditionally render details */}
            {showDetails && (
                <div>
                    <div className="launch-details">
                        <p className="launch-date">{formattedDate}</p>

                        {launch.links.video_link && (
                            <a
                                className="launch-video"
                                href={launch.links.video_link}
                            >
                                Video
                            </a>
                        )}
                    </div>

                    <div className="launch-details">
                        {launch.links.mission_patch ? (
                            <div className="launch-patch">
                                <img
                                    src={launch.links.mission_patch}
                                    alt={`${launch.mission_name}`}
                                />
                            </div>
                        ) : (
                            <p>No image yet.</p>
                        )}
                        {launch.details ? (
                            <p>{launch.details}</p>
                        ) : (
                            <p>No details available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LaunchCard;
