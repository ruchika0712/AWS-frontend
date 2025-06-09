import { useState } from "react";

interface Version {
    versionNumber: number;
    changedBy: string;
    changeSummary: string;
    timestamp: string;
    content: string;
}

export const useFileVersion = (fileId: string) => {
    const [versions, setVersions] = useState<Version[]>([]);

    // Fetch versions from the server
    const fetchVersions = async () => {
        try {
            const response = await fetch(`/api/versions/${fileId}`);
            const data = await response.json();
            setVersions(data);
        } catch (error) {
            console.error("Error fetching versions:", error);
        }
    };

    // Add a new version
    const addVersion = async (versionData: Omit<Version, "versionNumber" | "timestamp">) => {
        try {
            const response = await fetch(`/api/versions/${fileId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(versionData),
            });

            if (response.ok) {
                await fetchVersions(); // Refresh the version list
            }
        } catch (error) {
            console.error("Error adding version:", error);
        }
    };

    // Download changelog
    const downloadChangelog = () => {
        window.location.href = `/api/export/${fileId}`;
    };

    return { versions, fetchVersions, addVersion, downloadChangelog };
};
