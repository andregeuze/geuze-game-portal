using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GeuzePortal.Data.Entities
{
    [Serializable]
    public class Enemy
    {
        /// <summary>
        /// The Enemy's health
        /// </summary>
        public int health;

        public Enemy()
        {
            this.health = 3;
        }
    }
}
