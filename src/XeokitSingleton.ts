import { Viewer } from "@xeokit/xeokit-sdk";

let xeokit: Viewer | null = null;

export const setXeokit = (viewer: Viewer) => {
    xeokit = viewer;
}

export const getXeokit = () => {
    return xeokit;
}