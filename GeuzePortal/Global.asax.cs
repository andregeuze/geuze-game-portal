namespace GeuzePortal
{
    using GeuzePortal.App_Config;
    using Microsoft.AspNet.SignalR;
    using System;
    using System.Web;
    using System.Web.Http;
    using System.Web.Mvc;
    using System.Web.Optimization;
    using System.Web.Routing;

    /// <summary>The mvc application.</summary>
    public class MvcApplication : HttpApplication
    {
        /// <summary>The application_ start.</summary>
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterAuth();

            // Make connections wait 50s maximum for any response. After
            // 50s are up, trigger a timeout command and make the client reconnect.
            GlobalHost.Configuration.ConnectionTimeout = TimeSpan.FromSeconds(5);
        }
    }
}