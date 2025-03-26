import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("load-checklist", "routes/load-checklist.tsx"),
    route("checklist/:checklistId", "routes/checklist.tsx")
] satisfies RouteConfig;
