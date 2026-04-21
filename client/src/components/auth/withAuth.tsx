import React from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import type { Role } from "../../types/auth.types";

export function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    allowedRoles?: Role[]
) {
    return (props: P) => (
        <ProtectedRoute allowedRoles={allowedRoles}>
            <Component {...props} />
        </ProtectedRoute>
    );
}
