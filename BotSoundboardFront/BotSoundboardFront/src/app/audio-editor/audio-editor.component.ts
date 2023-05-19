import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { StoreService } from 'src/services/store/store.service';
declare var WaveSurfer: any;

declare var lamejs: any;



@Component({
  selector: 'app-audio-editor',
  templateUrl: './audio-editor.component.html',
  styleUrls: ['./audio-editor.component.css']
})
export class AudioEditorComponent implements OnInit {

  protected wavesurfer: any;
  public localBase64: string = '';
  public volume: number = 50;
  public isPaused: boolean = true;
  public region: any;

  @ViewChild('waveform') private waveform: any | undefined;

  constructor(store: StoreService) {
    store.wavesurferBase64$.subscribe((base64: string) => {
      this.initWaveSurfer();
      this.loadBase64Sound(base64);
    })
  }

  ngOnInit() { }

  initWaveSurfer() {
    const myNode = document.getElementById("waveform");
    while (myNode?.firstChild) { if (myNode.lastChild) myNode.removeChild(myNode.lastChild); }

    this.wavesurfer = WaveSurfer.create({
      container: document.querySelector('#waveform'),
      waveColor: '#D9DCFF',
      progressColor: '#4353FF',
      cursorColor: '#4353FF',
      barWidth: 3,
      barRadius: 3,
      cursorWidth: 1,
      height: 200,
      barGap: 3,
      fillParent: true,
      minPxPerSec: 10,
      plugins: [
        WaveSurfer.regions.create({
          regionsMinLength: 1,
          enableDragSelection: {
            slop: 5,
          },
          dragSelection: {
            slop: 5
          }
        })
      ]
    });

    const margin = 0.1;
    this.wavesurfer.on('ready', () => {
      let duration = this.wavesurfer.getDuration();
      this.wavesurfer.addRegion({
        start: duration * margin, // time in seconds
        end: this.wavesurfer.getDuration() - (duration * margin), // time in seconds
        color: 'hsla(222, 93%, 74%, 0.5)',
        loop: false,
        multiple: false,
        id: "region",
        // drag: false
      });

      this.wavesurfer.skip(duration * margin);
    });

    this.wavesurfer.on('region-created', (region: any) => {

      // this.initRegionEvents();
      if (Object.keys(this.wavesurfer.regions.list).length > 1)
        region.remove();
      else {
        console.log("init", region);
        this.region = region;
      }
    })

    this.wavesurfer.on('pause', () => {
      this.isPaused = true;
    });

    this.wavesurfer.on('play', () => {
      this.isPaused = false;
    });

    this.wavesurfer.on('finish', () => {
      this.isPaused = true;
    });
  }

  convertToBlob(binary: Uint8Array): Blob {
    return new Blob([binary], {
      type: 'audio/ogg'
    });
  }

  convertBase64ToBinary(base64data: string) {
    let raw = window.atob(base64data);
    let rawLength = raw.length;
    let arr = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      arr[i] = raw.charCodeAt(i);
    } return arr;
  }

  playPause() {
    if (this.isPaused) this.wavesurfer.regions.list["region"].play()
    else this.wavesurfer.pause();
  }

  loadBase64Sound(base64: string) {
    let binary = this.convertBase64ToBinary(base64);
    let blob = this.convertToBlob(binary);
    this.wavesurfer.loadBlob(blob);
  }

  initRegionEvents() {
    this.region.on('update', (region: any) => {
      console.log("update", region);
      this.region = region;
    });

    this.region.on('update-end', (region: any) => {
      console.log("update-end", region);
      this.region = region;
    });
  }

  onSliderChange(event: any) {
    this.wavesurfer.setVolume(event.value / 100);
  }

  unsubscribleAll() {
    this.wavesurfer.unAll();
  }

  saveRegion() {
    console.log(this.region);


    // Obtenir la région sélectionnée
    let region = this.region;

    // Configurer l'encodeur lamejs
    const sampleRate = this.wavesurfer.backend.getAudioContext().sampleRate;
    const numChannels = this.wavesurfer.backend.buffer.numberOfChannels;
    const encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, 128);
    const buffer = this.wavesurfer.backend.buffer.getChannelData(0);
    const length = buffer.length * numChannels;
    const interleaved = new Int16Array(length);
    let index = 0;
    let volume = 1;
    for (let i = 0; i < length; i++) {
      interleaved[i] = Math.max(-1, Math.min(1, buffer[index])) * 0x7fff * volume;
      index += numChannels;
    }
  }

  downloadSelection() {
    // Obtenir la région sélectionnée
    const region = this.wavesurfer.regions.list[Object.keys(this.wavesurfer.regions.list)[0]];
    if (!region) {
      return;
    }

    // Configurer l'encodeur lamejs
    const sampleRate = this.wavesurfer.backend.getAudioContext().sampleRate;
    const numChannels = this.wavesurfer.backend.buffer.numberOfChannels;
    const encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, 128);
    const buffer = this.wavesurfer.backend.buffer.getChannelData(0);
    const length = buffer.length * numChannels;
    const interleaved = new Int16Array(length);
    let index = 0;
    let volume = 1;
    for (let i = 0; i < length; i++) {
      interleaved[i] = Math.max(-1, Math.min(1, buffer[index])) * 0x7fff * volume;
      index += numChannels;
    }
  }

  downloadMp3() {
    var MP3Blob: any = this.analyzeAudioBuffer(this.wavesurfer.backend.buffer);
    console.log('here is your mp3 url:');
    console.log(URL.createObjectURL(MP3Blob));
  }

  analyzeAudioBuffer(aBuffer: any) {
    let numOfChan = aBuffer.numberOfChannels,
      btwLength = aBuffer.length * numOfChan * 2 + 44,
      btwArrBuff = new ArrayBuffer(btwLength),
      btwView = new DataView(btwArrBuff),
      btwChnls = [],
      btwIndex,
      btwSample,
      btwOffset = 0,
      btwPos = 0;
    setUint32(0x46464952); // "RIFF"
    setUint32(btwLength - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(aBuffer.sampleRate);
    setUint32(aBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit
    setUint32(0x61746164); // "data" - chunk
    setUint32(btwLength - btwPos - 4); // chunk length

    for (btwIndex = 0; btwIndex < aBuffer.numberOfChannels; btwIndex++)
      btwChnls.push(aBuffer.getChannelData(btwIndex));

    while (btwPos < btwLength) {
      for (btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
        // interleave btwChnls
        btwSample = Math.max(-1, Math.min(1, btwChnls[btwIndex][btwOffset])); // clamp
        btwSample = (0.5 + btwSample < 0 ? btwSample * 32768 : btwSample * 32767) | 0; // scale to 16-bit signed int
        btwView.setInt16(btwPos, btwSample, true); // write 16-bit sample
        btwPos += 2;
      }
      btwOffset++; // next source sample
    }

    let wavHdr = lamejs.WavHeader.readHeader(new DataView(btwArrBuff));

    //Stereo
    let data = new Int16Array(btwArrBuff, wavHdr.dataOffset, wavHdr.dataLen / 2);
    let leftData = [];
    let rightData = [];
    for (let i = 0; i < data.length; i += 2) {
      leftData.push(data[i]);
      rightData.push(data[i + 1]);
    }
    var left = new Int16Array(leftData);
    var right = new Int16Array(rightData);

    //STEREO
    if (wavHdr.channels === 2)
      return this.bufferToMp3(wavHdr.channels, wavHdr.sampleRate, left, right);
    //MONO
    else if (wavHdr.channels === 1)
      return this.bufferToMp3(wavHdr.channels, wavHdr.sampleRate, data, null);


    function setUint16(data: any) {
      btwView.setUint16(btwPos, data, true);
      btwPos += 2;
    }

    function setUint32(data: any) {
      btwView.setUint32(btwPos, data, true);
      btwPos += 4;
    }
    return null;
  }

  bufferToMp3(channels: any, sampleRate: any, left: any, right: any) {
    var buffer = [];
    var mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
    var remaining = left.length;
    var samplesPerFrame = 1152;


    for (var i = 0; remaining >= samplesPerFrame; i += samplesPerFrame) {

      if (!right) {
        var mono = left.subarray(i, i + samplesPerFrame);
        var mp3buf = mp3enc.encodeBuffer(mono);
      }
      else {
        var leftChunk = left.subarray(i, i + samplesPerFrame);        
        var rightChunk = right.subarray(i, i + samplesPerFrame);
        var mp3buf = mp3enc.encodeBuffer(leftChunk, rightChunk);
      }
      if (mp3buf.length > 0) {
        buffer.push(mp3buf);//new Int8Array(mp3buf));
      }
      remaining -= samplesPerFrame;
    }
    var d = mp3enc.flush();
    if (d.length > 0) {
      buffer.push(new Int8Array(d));
    }

    var mp3Blob = new Blob(buffer, { type: 'audio/mpeg' });
    var bUrl = window.URL.createObjectURL(mp3Blob);

    // send the download link to the console
    console.log('mp3 download:', bUrl);
    return mp3Blob;

  }
}