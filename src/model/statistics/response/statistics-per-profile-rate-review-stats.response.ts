import { REVIEW } from "../../call-history/review.enum";

export interface PerProfileRateReviewStatsRESP {
    perProfileMeanCallRates: number | null;
    reviewsCount: { [key in REVIEW]: number };
}
