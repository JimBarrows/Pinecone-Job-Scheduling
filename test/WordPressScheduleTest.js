/**
 * Created by JimBarrows on 10/14/16.
 */
'use strict';
import {Account, BlogPostSchema, Campaign} from "@reallybigtree/pinecone-models";
import amqp from "amqplib";
import chai from "chai";
import {cleanDatabase, createAccount, createApiClient, hash, login, salt, user} from "./fixtures";
import {enqueBlogPosts} from "../wordpressJobs";
import moment from "moment";
import Promise from "bluebird";
import waitUntil from "wait-until";


const expect = chai.expect;

describe("WordPress schedule", function () {
	var campaign     = {};
	var loggedInUser = {};

	const queueName = "wordpress";

	var createCampaign = function () {
		return Campaign.create({
			name: 'Test Campaign 1',
			owner: loggedInUser._id
		});
	};

	beforeEach(function (done) {
		cleanDatabase()
				.then(()=>createAccount())
				.then((account)=> {
					loggedInUser = account;
					return createCampaign();
				})
				.then((newCampaign)=> {
					campaign = newCampaign;
					done();
				})
				.catch((error) => done(error));

	});

	describe("enque blogpost function", function () {

		it("should put a blog post on the wordpress queue", function (done) {

			var reallyDone = false;

			const testDone = function (param) {
				expect(param).to.not.exist;
				reallyDone = true;
				return Promise.resolve();
			};

			const job = {
				attrs: {
					lastRunAt: moment().subtract(10, "minutes")
				}
			};

			campaign.blogPosts.push({
				title: "should put a blog post on the wordpress queue",
				body: "This is a  body",
				publishDate: moment()
			});

			campaign.blogPosts.push({
				title: "frakity frak",
				body: "This is a  body",
				publishDate: moment().add(30, "minutes")
			});

			campaign.save()
					.then((updatedCampaign) => {
						campaign = updatedCampaign;
						enqueBlogPosts(job, testDone);
						waitUntil().interval(500).times(50).condition(() => reallyDone)
								.done(function (functionExecuted) {
									expect(functionExecuted).to.be.true;
									const open = amqp.connect("amqp://localhost");
									open
											.then((connection) => connection.createChannel())
											.then((channel) => channel.assertQueue("wordpress")
													.then((ok)=> channel.get("wordpress")))
											.then((message) => {
												console.log("message: ", message);
												expect(message).to.not.be.false;
												console.log("message: ", message);
												done();
											})
											.catch((error) => done(error));

								})
					})
					.catch((error) => done(error));
		});
	});
});