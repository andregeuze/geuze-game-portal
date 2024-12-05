using System.Web.Mvc;

namespace GeuzePortal.Filters
{
    public class CustomLayoutAttribute : ActionFilterAttribute
    {
        private readonly string _masterName;

        public CustomLayoutAttribute(string masterName)
        {
            _masterName = masterName;
        }

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            base.OnActionExecuted(filterContext);
            var result = filterContext.Result as ViewResult;
            if (result != null)
            {
                result.MasterName = _masterName;
            }
        }
    }
}