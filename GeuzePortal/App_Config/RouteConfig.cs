using System;

namespace GeuzePortal.App_Config
{
    using System.Web.Mvc;
    using System.Web.Routing;

    /// <summary>The route config.</summary>
    public class RouteConfig
    {
        /// <summary>The register routes.</summary>
        /// <param name="routes">The routes.</param>
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            // Map the default route
            routes.MapRoute(
                "Default",
                "{id}",
                new { controller = "Home", action = "Index", id = Guid.Empty },
                new { id = @"^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$" }
            );
        }
    }
}