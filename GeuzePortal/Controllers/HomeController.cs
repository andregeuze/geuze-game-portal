using System;
using System.Web.Mvc;
using GeuzePortal.Filters;

namespace GeuzePortal.Controllers
{
    [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]
    public class HomeController : Controller
    {
        [CustomLayout("_Layout")]
        public ActionResult Index(Guid id)
        {
            if (id.Equals(Guid.Empty))
            {
                // Create a new game
            }
            else
            {
                // Load the existing game with this ID
            }

            // Set up a model with the game data

            // Return the view with the model
            return View();
        }
    }
}