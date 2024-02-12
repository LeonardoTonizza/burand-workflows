export function generateGoogleLoggingURL(projectId, traceIds) {
    const baseURL = 'https://console.cloud.google.com/logs/query;';
    const query = traceIds.map(id => `trace: "projects/${projectId}/traces/${id.split('/')[0]}"`).join(' OR ');
    const encodedQuery = encodeURIComponent(query);
    return `${baseURL}?query=${encodedQuery}`;
}
