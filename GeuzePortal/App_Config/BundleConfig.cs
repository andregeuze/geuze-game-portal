using System.Web.Optimization;

namespace GeuzePortal.App_Config
{
    /// <summary>The bundle config.</summary>
    public class BundleConfig
    {
        /// <summary>
        ///     Register bundles
        /// </summary>
        /// <param name="bundles"></param>
        public static void RegisterBundles(BundleCollection bundles)
        {
            // Register the ignores
            bundles.IgnoreList.Ignore("*.ts", OptimizationMode.Always);

            // Register the Styles
            bundles.Add(new StyleBundle("~/bundles/style").Include(
                "~/Content/style.css"));

            // Register the Library Scripts
            bundles.Add(new ScriptBundle("~/bundles/js").Include(
                "~/Scripts/Libraries/jquery.js",
                "~/Scripts/Libraries/bootstrap.js",
                "~/Scripts/Libraries/knockout.js",
                "~/Scripts/Libraries/toastr.js",
                "~/Scripts/Libraries/three.js",
                "~/Scripts/Libraries/tween.js",
                "~/Scripts/Libraries/xt.*"));
            
            // Register the custom Scripts
            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/Scripts/App.js"));
        }
    }
}