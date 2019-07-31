import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  bgColor = '3A57C4';
  selectedPage;
  selectedPath = '';
  primaryColor: any;
  secondryColor: any;
  pages = [
    {
      title: 'Home',
      url: '/members/dashboard',
      icon: 'home'
    },
    {
      title: 'Bottali',
      url: '/drums',
      image: 'assets/images/drum_icon.svg'
    }
    ,
    {
      title: 'Prodotti',
      image: 'assets/images/flasks_white.svg',
      children: [
        {
          title: 'Depositi',
          url: '/storage',
          image: 'assets/images/tanks_icon.svg',
        },
        {
          title: 'Prodotti in polvere',
          url: '/polveri',
          icon: 'list'
        }
      ]
      },
    {
      title: 'ODP',
      image: 'assets/images/recipe_icon.svg',
      children: [
        {
          title: 'Calendario ODP',
          url: '/calendar',
          icon: 'calendar'
        },
        {
          title: 'In esecuzione',
          url: '/odplist/1',
          fontawesome:'list'
        },
        {
          title: 'In coda',
          url: '/odplist/0',
          fontawesome:'list'
        },
        {
          title: 'Archivio',
          url: '/odplist/2',
          fontawesome:'list'
        }

      ]
    },
    {
      title: 'Allarmi',
      url: '/alarms',
      fontawesome: 'exclamation-triangle'
    },
    {
      title: 'Profilo',
      url: '/menu/profile',
      icon: 'person'
    },
    {
      title: 'Impostazioni',
      url: '/settings',
      fontawesome: 'cog'
    }
 
  ];
 
  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });
  }

  getstyle() {
    this.primaryColor = localStorage.getItem("primary_color");
    this.secondryColor = localStorage.getItem("secondry_color");
    return {
      background:
        "linear-gradient(" + this.primaryColor + "," + this.secondryColor + ")"
    };
  };
  openPage(page) {
    this.selectedPage = "";
    this.pages.forEach(element => {
      if (element.title == page) {
        if (page != "Home") {
         // this.nav.push(element.component);
        } else {
         // this.nav.setRoot(element.component);
        }
      }
    });
  };
  ngOnInit() {
 
  }

}
