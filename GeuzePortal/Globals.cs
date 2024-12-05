namespace GeuzePortal
{
    using System.Reflection;

    /// <summary>The globals.</summary>
    public class Globals
    {
        /// <summary>The website title.</summary>
        public const string WebsiteTitle = "World of Raul";

        /// <summary>The version.</summary>
        public static readonly string Version = "v" + Assembly.GetExecutingAssembly().GetName().Version;
    }
}