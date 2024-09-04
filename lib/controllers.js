'use strict';

const Controllers = module.exports;

Controllers.getToken = async function(req, res)

{
        let token = await meta.settings.get('ai-chat').token;
        if(token == undefined)
        {
                axios.post(hostURL, {
                        grant_type: client_credentials,
                        client_id: clientId,
                        client_secret: clientSecret
                  }, { headers: {"Content-type" : "application/x-www-form-urlencoded"}})
                  .then( async function (response) {
                        winston.info(response);
                        winston.info(response.access_token)
                        await meta.settings.setOne('ai-chat', 'token', response.token)
                  })
                  .catch(function (error) {
                        winston.info(error);
                  });

        }

        helpers.formatApiResponse(200, res, {
                foobar: req.params.param1,
        });
}

Controllers.renderAdminPage = function (req, res/* , next */) {
        /*
                Make sure the route matches your path to template exactly.

                If your route was:
                        myforum.com/some/complex/route/
                your template should be:
                        templates/some/complex/route.tpl
                and you would render it like so:
                        res.render('some/complex/route');
        */        res.render('admin/plugins/ai-chat', {
                title: 'ChatTPS',
        });
};
