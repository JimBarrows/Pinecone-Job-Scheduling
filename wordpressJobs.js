/**
 * Created by JimBarrows on 10/14/16.
 */
'use strict';
import {Campaign} from "@reallybigtree/pinecone-models";
import moment from "moment";

export function enqueBlogPosts(job, done) {
	var now       = moment();
	var lastRunAt = job.attrs.lastRunAt;


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