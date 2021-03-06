//candidates.js
//API for getting info on candidates

var logger = require('./utils/logger');
var db = require('./campaignFinanceDb')();
var q = require('q');

module.exports = {
    getAllCandidates: getAllCandidates,
    getCandidate: getCandidate,
    getRace: getRace,
    getElectedOfficials: getElectedOfficials
}

function getAllCandidates() {

    var defer = q.defer();

    db.candidates
        .find({},{'_id':1})
        .toArray()
        .then(function(candidate_docs){
            var candidates = candidate_docs.map(function(candidate){
                        var id = candidate._id.last_name;
                        return {
                            candidate: candidate._id,
                            resourceUrl: constructResourceUrl('candidate', id, candidate._id)
                        }
            });
            defer.resolve(candidates);
        }, function(err){
            defer.reject(err);       
        });

    return defer.promise;
}

function getCandidate(lastName, firstName, middleName){
    var defer = q.defer();

    var id = {};
    id['_id.first_name'] = firstName;
    id['_id.last_name'] = lastName;

}

function getRace(position, year) {


}

function getElectedOfficials(year) {
    var deferred = q.defer();
    db.candidates
        .find({"held_office.elected_year": year})
        .toArray()
        .then(function(electedOfficials){
            deferred.resolve(electedOfficials);
        }, function(err){
            deferred.reject(err);
        });

    return deferred.promise;
}

function constructResourceUrl(endpoint, id, queryParams) {
    var url = '/dc-campaign-finance/api/' + endpoint + '/' + id + '?';
    for(key in queryParams) {
        url = url + key + '=' + queryParams[key] + '&';
    }

    return url;    
    
}

function calculateCorporateToGrassRootRatio(corporateDonors, individualDonors) {
    var ratio = null;
    if(corporateDonors == 0){
        ratio = 1;
    } else if(individualDonors == 0){
        ratio = 0;
    } else {
        ratio = corporateDonors/individualDonors;
    }

    return ratio;
};

function calculateContributorQuality(numberOfDonors, quality){
    return quality/(numberOfDonors*8);
};

