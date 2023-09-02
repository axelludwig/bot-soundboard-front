import { Component, HostListener, Inject, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { SocketService } from 'src/services/socket/socket.service';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { StoreService } from 'src/services/store/store.service';
import { SoundUploadModalComponent } from './modals/sound-upload-modal/sound-upload-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Sound } from './declarations';
import { StickyDirection } from '@angular/cdk/table';
import { SplitAreaDirective, SplitComponent } from 'angular-split';

declare var WaveSurfer: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent {
  @ViewChild(SplitComponent) splitEl: SplitComponent | null = null;
  @ViewChildren(SplitAreaDirective) areasEl: QueryList<SplitAreaDirective> | null = null;

  public socketConnection: boolean = false;
  public isPaused = true;
  public variable: string = "";

  public menuSize: number = 1000;
  public queueSize: number = 500;

  public root: any = document.querySelector(':root');

  constructor(private store: StoreService, private socketService: SocketService, private axiosService: AxiosService, public dialog: MatDialog) {
    this.changeThemeColor('#6c61fa')
    this.socketService.connect$.subscribe(() => {
      this.socketConnection = true;
    })

    this.socketService.disconnect$.subscribe(() => {
      this.socketConnection = false;
    })


    let sizes = localStorage.getItem('sizes');
    if (sizes) {
      let sizesArray = sizes.split(',');
      this.menuSize = parseInt(sizesArray[1]);
      this.queueSize = parseInt(sizesArray[2]);
    }
  }

  ngOnInit() { }

  getContrastYIQ(hexcolor: string) {
    var r = parseInt(hexcolor.substring(1, 3), 16);
    var g = parseInt(hexcolor.substring(3, 5), 16);
    var b = parseInt(hexcolor.substring(5, 7), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  testHttp() {
    var options: GetOptions = {
      url: "/"
    }
    this.axiosService.get(options).then((res) => {
      console.log(res);
    })
      .catch((err) => {
        console.log(err);
      })
  }

  apply() {
    let element = <HTMLElement>document.querySelector(':root');
    element.style.setProperty('--primary', this.variable);
  }

  dragEnd(event: any) {
    console.log(event.sizes);

    this.menuSize = event.sizes[1];
    this.queueSize = event.sizes[2];

    console.log(event.sizes[1] + event.sizes[2]);


    this.saveSizes(event.sizes)

  }

  saveSizes(sizes: number[]) {
    localStorage.setItem("sizes", sizes.join(','));
  }

  myFunction_get() {
    var rs = getComputedStyle(this.root);
    alert("The value of --primary is: " + rs.getPropertyValue('--primary'));
  }

  myFunction_set() {
    this.root.style.setProperty('--primary', 'red');
  }

  shadeColor(color: string, percent: number) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = (R * (100 + percent) / 100);
    G = (G * (100 + percent) / 100);
    B = (B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    R = Math.round(R)
    G = Math.round(G)
    B = Math.round(B)

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
  }

  changeThemeColor(color: string) {
    this.root.style.setProperty('--primary', color);
    this.root.style.setProperty('--primary-variant', this.shadeColor(color, -40));
    this.root.style.setProperty('--text-color', this.getContrastYIQ(color));
    this.root.style.setProperty('--primary-complemantary', this.invertColor(color));
    this.root.style.setProperty('--primary-opacity', this.hexToRGB(color, '0.20'));
  }

  invertColor(hex: string) {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
      g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
      b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + this.padZero(r) + this.padZero(g) + this.padZero(b);
  }

  padZero(str: string, len?: number) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }

  hexToRGB(hex: string, alpha: string) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  onClose1() {
    console.log(this.menuSize);

    // this.areasEl.area[1].size = this.menuSize;
    console.log();

    this.areasEl?.forEach(element => {
      console.log(element);
      
    });


    // onExpand1() {
    //   this.areasEl.first.expand()
    // }

    // onExpand3() {
    //   this.areasEl.last.expand()
    // }

    var width = document.getElementById('split')?.offsetWidth;
    console.log(width);


    setTimeout(() => {
      console.log(this.menuSize);
    }, 2000);
    // this.guildsSize = 0;
  }
}
