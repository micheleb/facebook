var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var mongodb = Promise.promisifyAll(require('mongodb'));
var debug = require('debug')('mongo');
var nconf = require('nconf');

var dbConnection = function() {
    return mongodb
        .MongoClient
        .connectAsync(nconf.get('mongodb'))
        .disposer(function(db) {
            return db.close();
        });
};

var writeOne = function(cName, dataObject) {
    return Promise.using(dbConnection(), function(db) {
        return db
            .collection(cName)
            .insert(dataObject)
            .then(function(results) {
                return true;
            })
            .catch(function(error) {
                debug("writeOne Error %s (%j)", cName, error);
                return false;
            });
    });
};

var updateOne = function(cName, selector, updated) {
    debug("updateOne in %s selector %j ", cName, selector);
    return Promise.using(dbConnection(), function(db) {
        return db
            .collection(cName)
            .updateOne(selector, updated, { upsert: true})
            .then(function(result) {
                return true;
            })
            .catch(function(error) {
                debug("updateOne Error %s (%j)", cName, error);
                return false;
            });
    });
};

var writeMany = function(cName, dataObjects) {
    debug("writeMany in %s of %d objects", cName, _.size(dataObjects));
    return Promise.using(dbConnection(), function(db) {
        return db
            .collection(cName)
            .insertMany(dataObjects)
            .then(function(results) {
                return true;
            })
            .catch(function(error) {
                debug("writeMany Error %s (%j)", cName, error);
                return false;
            });
    });
};

var read = function(cName, selector) {
    debug("read in %s by %j selector", cName, selector);
    return Promise.using(dbConnection(), function(db) {
        return db
            .collection(cName)
            .find(selector)
            .toArray();
    });
};

var readLimit = function(cName, selector, sorter, limitN, past) {

    if(_.isNaN(past))
        past = 0;
    debug("readLimit in %s by %j sort %j max %d past %d", 
        cName, selector, sorter, limitN, past);

    return Promise.using(dbConnection(), function(db) {
        return db
            .collection(cName)
            .find(selector)
            .sort(sorter)
            .limit(limitN + past)
            .toArray()
            .then(function(x) {
                if(past)
                    return _.takeRight(x, limitN);
                return x;
            });
    });
};

var count = function(cName, selector) {
    debug("count in %s by %j selector", cName, selector);
    return Promise.using(dbConnection(), function(db) {
        return db
            .collection(cName)
            .count()
            .then(function(results) {
                /* anything to do here ? I don't think so */
                return results;
            });
    });
};

var aggregate = function(cName, queryObject) {
    debug("aggregate get called in %s for %j", cName, queryObject);
    return Promise.using(dbConnection(), function(db) {
        return db
            .collection(cName)
            .aggregateAsync(queryObject);
    });
};

module.exports = {
    aggregate: aggregate,
    writeOne: writeOne,
    writeMany: writeMany,
    updateOne: updateOne,
    readLimit: readLimit,
    read: read,
    count: count
};