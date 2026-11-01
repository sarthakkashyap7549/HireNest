import seedJobs from "../data/jobs";
import { http, USE_MOCK, delay } from "./http";

/*
 * BACKEND CONTRACT
 *   GET /jobs -> { jobs: [...] }
 * Filtering runs in the browser today. For large datasets, pass the filters as query
 * params (GET /jobs?q=react&location=Mohali&type=Full-time&page=1) and let the server filter.
 */
export const jobService = {
  async getJobs() {
    if (!USE_MOCK) {
      const { jobs } = await http("/jobs");
      return jobs;
    }
    await delay(300);
    return seedJobs;
  },
};
