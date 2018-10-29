/**
 *  @license
 *    Copyright 2018 Brigham Young University
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 **/
'use strict';
const EnforcerRef  = require('../enforcer-ref');

const rxContentType = /^content-type$/i;
const rxLinkName = /^[a-zA-Z0-9.\-_]+$/;

module.exports = {
    init: function (data) {

    },

    prototype: {},

    validator: function ({ major }) {
        const MediaType = require('./MediaType');
        return {
            type: 'object',
            properties: {
                description: {
                    type: 'string',
                    required: true
                },
                content: {
                    allowed: major === 3,
                    type: 'object',
                    additionalProperties: EnforcerRef('MediaType', {
                        errors: function({ key }) {
                            if (!MediaType.rx.mediaType.test(key)) data.warn('Media type appears invalid');
                        }
                    })
                },
                examples: {
                    allowed: major === 2,
                    type: 'object',
                    additionalProperties: true
                },
                headers: {
                    type: 'object',
                    additionalProperties: EnforcerRef('Header', {
                        ignore: ({ key }) => rxContentType.test(key)
                    })
                },
                links: {
                    allowed: major === 3,
                    type: 'object',
                    additionalProperties: EnforcerRef('Link', {
                        allowed: ({ key }) => rxLinkName.test(key) ? true : 'Invalid key used for link value'
                    })
                },
                schema: major === 2 ? EnforcerRef('Schema') : { allowed: false }
            }
        }
    }
};
