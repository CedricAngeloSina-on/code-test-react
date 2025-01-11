import "./launcherror.scss";

const LaunchError = ({ error }) => {
    return (
        <div className="error-container">
            <div className="error-message">
                Error loading launches: {error.message}
            </div>
        </div>
    );
};

export default LaunchError;
