using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GeuzePortal.Data.Entities
{
    [Serializable]
    public class Player
    {
        /// <summary>
        /// The  Name
        /// </summary>
        public string name;

        /// <summary>
        /// Experience
        /// </summary>
        public int experience;

        public Player()
        {
            this.name = "";
            this.experience = 1;
        }
    }
}
