import "./launchsearch.scss";

const LaunchSearch = ({ value, onChange }) => {
    return (
        <input
            type="text"
            placeholder="Search missions or rockets..."
            className="search-input"
            value={value}
            onChange={onChange}
        />
    );
};

export default LaunchSearch;
