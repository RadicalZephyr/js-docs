
DocPages = new Meteor.Collection("docs");

if (Meteor.isClient) {
    function setPage(page) {
        History.pushState({"page":page}, page, "?page="+page);
    }

    function stateHasPage(state) {
        return state.data.page !== undefined;
    }

    var History = window.History;

    Meteor.startup(function () {
        if (!stateHasPage(History.getState())) {
            var first = DocPages.findOne();
            if (first !== undefined) {
                setPage(first.name);
            }
        }
    });

    Template.menu.sites = function () {
        return DocPages.find().fetch();
    };

    Template.menu.events({
        'click .nav li a': function () {
            setPage(this.name);
        }
    });

    Template.frame.page = function () {
        var state = History.getState();
        return Meteor.absoluteUrl(state.data.page);
    };
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        var fs = __meteor_bootstrap__.require('fs');

        _.each(fs.readdirSync("public"),
               function (filename) {
                   if (DocPages.find({"name": filename}).count() < 1) {
                       DocPages.insert({"name": filename});
                   }
               });
    });
}
