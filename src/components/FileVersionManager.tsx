import React, { useEffect } from "react";
import { useFileVersion } from "../hooks/useFileVersion";

const FileVersionManager = ({ fileId }: { fileId: string }) => {
    const { versions, fetchVersions, addVersion, downloadChangelog } = useFileVersion(fileId);

    useEffect(() => {
        fetchVersions();
    }, [fetchVersions]);

    const handleAddVersion = () => {
        const newVersion = {
            changedBy: "User123",
            changeSummary: "Updated file content",
            content: "New content of the file",
        };
        addVersion(newVersion);
    };

    return (
        <div>
            <h3>Version History for {fileId}</h3>
            <ul>
                {versions.map((version) => (
                    <li key={version.versionNumber}>
                        Version {version.versionNumber}: {version.changeSummary} (by {version.changedBy})
                    </li>
                ))}
            </ul>
            <button onClick={handleAddVersion}>Add New Version</button>
            <button onClick={downloadChangelog}>Download Changelog</button>
        </div>
    );
};

export default FileVersionManager;

