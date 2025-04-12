import ErrorMessage from '@/components/error-message';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <ErrorBoundary FallbackComponent={({ error }) => <ErrorMessage message={error} />}>{children}</ErrorBoundary>
    </AppLayoutTemplate>
);
