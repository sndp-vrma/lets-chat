'use strict';

if (typeof window !== 'undefined' && typeof exports === 'undefined') {
    if (typeof window.utils !== 'object') {
        window.utils = {};
    }
}

if (typeof exports !== 'undefined') {
    var _ = require('underscore');
}

(function(exports) {
    //
    // Message Text Formatting
    //

    function trim(text) {
        return text.trim();
    }

    function mentions(text) {
        var mentionPattern = /\B@(\w+)(?!@)\b/g;
        return text.replace(mentionPattern, '<strong>@$1</strong>');
    }

    function links(text) {
        var imagePattern = /^\s*((https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;'"!()]*[-A-Z0-9+&@#\/%=~_|][.](jpe?g|png|gif))\s*$/i,
        linkPattern = /((https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;'"!()]*[-A-Z0-9+&@#\/%=~_|])/ig;

        if (imagePattern.test(text)) {
            return text.replace(imagePattern, function(url) {
                url = _.escape(url);
                return '<a class="thumbnail" href="' + url +
                       '" target="_blank"><img src="' + url +
                       '" alt="Pasted Image" /></a>';
            });
        } else {
            return text.replace(linkPattern, function(url) {
                url = _.escape(url);
                return '<a href="' + url + '" target="_blank">' + url + '</a>';
            });
        }
    }

    function emotes(text, extras) {
        var regex = new RegExp('\\B(:[a-z0-9_\\+\\-]+:?)[\\b]?', 'ig');

        return text.replace(regex, function(group) {
            var key = group.split(':')[1];
            var emote = _.find(extras.emotes, function(emote) {
                return emote.emote === key;
            });

            if (!emote) {
                return group;
            }

            var image = _.escape(emote.image),
                emo = _.escape(':' + emote.emote + ':'),
                size = _.escape(emote.size || 20);

            return '<img class="emote" src="' + image + '" title="' + emo + '" alt="' + emo + '" width="' + size + '" height="' + size + '" />';
        });
    }

    function replacements(text, extras) {
        _.each(extras.replacements, function(replacement) {
            text = text.replace(new RegExp(replacement.regex, 'ig'), replacement.template);
        });
        return text;
    }

    exports.format = function(text, extras) {
        var pipeline = [
            trim,
            mentions,
            links,
            emotes,
            replacements
        ];

        _.each(pipeline, function(func) {
            text = func(text, extras);
        });

        return text;
    };

})(typeof exports === 'undefined' ? window.utils.message = {} : exports);
