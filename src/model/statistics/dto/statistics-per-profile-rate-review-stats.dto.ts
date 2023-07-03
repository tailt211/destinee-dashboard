import { REVIEW } from "../../call-history/review.enum";

export interface PerProfileRateReviewStatsDTO {
    perProfileMeanCallRates: number | null;
    reviewsCount: { [key in REVIEW]: number };
}
