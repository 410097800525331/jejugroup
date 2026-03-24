(() => {
    'use strict';

    if (window.AdminApiClient) {
        return;
    }

    const apiConfigPromise = import('../../core/config/api_config.js');

    const toApiUrl = async (path) => {
        const { API_BASE_URL } = await apiConfigPromise;
        return `${API_BASE_URL}${path}`;
    };

    const fetchAdminPayload = async (path) => {
        const apiUrl = await toApiUrl(path);
        const response = await fetch(apiUrl, {
            credentials: 'include',
            headers: {
                Accept: 'application/json'
            },
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Admin API request failed: ${response.status}`);
        }

        const payload = await response.json();
        if (!payload?.success) {
            throw new Error(payload?.message || 'Admin API payload was not successful');
        }

        return payload.data ?? null;
    };

    const fetchAdminPayloadInBackground = (path, handlers = {}) => {
        const { onSuccess, onError } = handlers;

        void fetchAdminPayload(path)
            .then((payload) => {
                if (typeof onSuccess === 'function') {
                    onSuccess(payload);
                }
            })
            .catch((error) => {
                if (typeof onError === 'function') {
                    onError(error);
                    return;
                }
                console.warn('[AdminApiClient] Background admin payload load failed:', error);
            });
    };

    window.AdminApiClient = Object.freeze({
        fetchAdminPayload,
        fetchAdminPayloadInBackground,
        toApiUrl
    });
})();
