import {Campaign} from "@reallybigtree/pinecone-models";
import moment from "moment";

export function enqueBlogPosts(job, done) {
	let now       = moment();
	let lastRunAt = job.attrs.lastRunAt;

	Campaign.find({"blogPosts.publishDate": {$gt: lastRunAt, $lt: now}}, {"blogPosts.$": 1})
			.exec()
			.then(function (campaigns) {
				campaigns.forEach((c) => c.blogPosts.forEach((blogPost) => {
					// console.log("blogPost: ", blogPost);
				}));
				done();
			})
			.catch(function (error) {
				done(error);
			});
};