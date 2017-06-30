var watson=require('watson-developer-cloud');
var express=require('express');
var app=express();
var async=require('async');
require('./config/express')(app);
//URL for the same is by default embedded
var twitter = require('simple-twitter');
 twitter = new twitter('************', //consumer key from twitter api
                       '**************', //consumer secret key from twitter api
                       '******************', //acces token from twitter api
                       '******************'//acces token secret from twitter api
                       );
var personalityInsight=watson.personality_insights({
	version:'v2',
	username:'********************',//btain from ibm watson service
	password:'******'
});
app.get('/',function(req,res){
	res.render('index');
});
app.get('/temp',function(req,res){
	res.render('temp');
})
app.post('/profile',function(req,res){
	var finalArray=[],count=1;
	twitter.get('statuses/user_timeline','?screen_name='+req.body.name+'&count=150',function(error, data){
                var text=[],flag=0;
               // console.log(data);
                //data=data.replace(/\\/g,"");
                //res.send(data);
                var dta=JSON.parse(data);
                console.log(dta.length);
                //res.send(dta);
                var len=dta.length;
                console.log('len = ',len);
                async.each(dta,function(data,__callback){
				    var temp={};
				    temp.id=data.id_str;
				    temp.userid= data.user.id_str,
				    temp.sourceid= 'twitter',
				    temp.language= 'en',
				    temp.contenttype= 'text/plain',
				    temp.content= data.text.replace('[^(\\x20-\\x7F)]*',''),
				    temp.created= Date.parse(data.created_at)                	
				    text.push(temp);
				    __callback();
				},function(error){
				    if(!error){
				    	personalityInsight.profile({contentItems:text},function(err,results){
							if(err)
						    {
						    	res.send(err);
						    }
						    var finalData={};
						    var tmp=results.tree.children[0].children[0].children;
						    var special=tmp;
			       			finalData.openness=tmp[0].percentage;
						    finalData.conscientiousness=tmp[1].percentage;
						    finalData.extraversion=tmp[2].percentage;
						    finalData.agreeableness=tmp[3].percentage;
						    finalData.emotionalRage=tmp[4].percentage;
								finalData.image=dta[0].user.profile_image_url;
						    finalData.noOfTweets=dta[0].user.statuses_count;
						    finalData.name=dta[0].user.name;
						    finalData.percentageMatch=Math.abs(100-Math.abs(special[0].percentage+special[1].percentage+special[2].percentage+special[3].percentage+special[4].percentage-(tmp[0].percentage+tmp[4].percentage+tmp[3].percentage+tmp[2].percentage+tmp[1].percentage))*100);
						    finalData.twitterName=dta[0].user.screen_name;
						    finalData.description=dta[0].user.description;
						    finalData.noOfFollowers=dta[0].user.followers_count;
						    finalArray.push(finalData);
						    console.log('5 len=',finalArray.length);
						    var geo=encodeURI(req.body.lat+','+req.body.lang+','+'1000km');
						    console.log(geo,count);
							twitter.get('search/tweets','?geocode='+geo+'&count='+count,function(error,results){
								var reslt=JSON.parse(results);
								reslt=reslt.statuses;
								var len=reslt.length;
								console.log('3 len =',len);
								if(error)
								{
									res.send(error);
								}
								console.log('Async Call Started');
								async.each(reslt,function(item,callback){
									console.log('under Asnyc Now!');
									twitter.get('statuses/user_timeline','?screen_name='+item.user.screen_name+'&count=150',
										function(error, data){
										if(error)
										{
											res.send(error);
										}
										var text=[];
										console.log('here');
										var dta=JSON.parse(data);
										var len=dta.length;
						                console.log('4 len=',len);
						                async.each(dta,function(data,_callback){
											var temp={};
						                	temp.id=data.id_str;
						                	temp.userid= data.user.id_str,
						    				temp.sourceid= 'twitter',
						    				temp.language= 'en',
						    				temp.contenttype= 'text/plain',
						    				temp.content= data.text.replace('[^(\\x20-\\x7F)]*',''),
											temp.created= Date.parse(data.created_at)                	
						                	text.push(temp);
						                	_callback();
										},function(error){
											if(!error){
											    personalityInsight.profile({contentItems:text},function(err,results){
													if(err)
													{
														res.send(err);
									            	}
													else
													{
														var finalData={};
														var tmp=results.tree.children[0].children[0].children;
										            	finalData.openness=tmp[0].percentage;
														finalData.conscientiousness=tmp[1].percentage;
														finalData.extraversion=tmp[2].percentage;
														finalData.agreeableness=tmp[3].percentage;
														finalData.emotionalRage=tmp[4].percentage;
														finalData.image=dta[0].user.profile_image_url;
														finalData.noOfTweets=dta[0].user.statuses_count;
														finalData.name=dta[0].user.name;
														finalData.percentageMatch=Math.abs(100-Math.abs(special[0].percentage+special[1].percentage+special[2].percentage+special[3].percentage+special[4].percentage-(tmp[0].percentage+tmp[4].percentage+tmp[3].percentage+tmp[2].percentage+tmp[1].percentage))*100);
														finalData.twitterName=dta[0].user.screen_name;
														finalData.description=dta[0].user.description;
														finalData.noOfFollowers=dta[0].user.followers_count;
														finalArray.push(finalData);
														console.log('5 len=',finalArray.length,count+1);
														if(finalArray.length==count+1)
														{
															//console.log('callback should be called');
															callback();
															//callback();
															console.log('callback callback!');
														}

										        	}
												});
											}
						               	});               
								   		});
									},function(err){
										console.log('here');
										if(err)
											res.send(err);
										console.log(finalArray);
										res.render('profile',{data:finalArray});
										
								});
							});
						});		               		
					}
				});      
		});
	//console.log(finalArray);
});
//process.env.VCAP_APP_PORT for ibm bluemix
var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('Magic Happens at : ', port);
