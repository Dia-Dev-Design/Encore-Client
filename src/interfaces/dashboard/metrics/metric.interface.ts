export interface Metric {
    signups: {
        total: number;
        changeRate: number;
    };
    onboardings: {
        total: number;
        changeRate: number;
    };
    dissolutions: {
        total: number;
        changeRate: number;
    };
    rate_prospects_clients: {
        prospects: number;
        clients: number;
        change_rate: number;
        prospects_to_clients: number;
    };
}