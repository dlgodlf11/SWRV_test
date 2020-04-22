<template class="noscroll">
  <v-container class="fill-height px-6" fluid>
    <v-row align="center" justify="center">
      <h1>Measure</h1>
    </v-row>
    <v-row align="center" justify="center">
      <p class="pb-4">check your fat</p>
    </v-row>
    <v-row align="center" justify="space-around">
      <v-slider
        class="py-4"
        v-model="tall"
        color="grey darken-3"
        label="키"
        hint="Be honest"
        min="1"
        max="300"
        thumb-color="light-green "
        thumb-label
        hide-details
      >
        <template v-slot:append>
          <v-text-field
            v-model="tall"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 60px"
          ></v-text-field>
        </template>
      </v-slider>
    </v-row>

    <v-row align="center" justify="space-around">
      <v-slider
        class="py-4"
        v-model="kg"
        color="grey darken-3"
        label="몸무게"
        hint="Be honest"
        min="1"
        max="200"
        thumb-color="light-green "
        thumb-label
        hide-details
      >
        <template v-slot:append>
          <v-text-field
            v-model="kg"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 60px"
          ></v-text-field>
        </template>
      </v-slider>
    </v-row>
    <v-row align="center" justify="space-around">
      <v-file-input
        accept="image/*"
        color="light-green "
        label="정면 사진."
        prepend-icon="mdi-camera"
        v-model="frontimg"
      ></v-file-input>
    </v-row>
    <v-row align="center" justify="end">
      <v-file-input
        accept="image/*"
        color="light-green "
        label="측면 사진."
        prepend-icon="mdi-camera"
        v-model="sideimg"
      ></v-file-input>
    </v-row>
    <v-row align="center" justify="end">
      <v-radio-group v-model="gender" :mandatory="false" row>
        <v-radio label="남" value="남"></v-radio>
        <v-radio label="여" value="여"></v-radio>
      </v-radio-group>
    </v-row>

    <v-row align="center" justify="space-between">
      <v-col align="start">
        <v-btn @click="resetdata">초기화</v-btn>
      </v-col>
      <v-col align="end">
        <v-btn @click="onclick">측정하기</v-btn>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-progress-linear :active="active" indeterminate height="4" color="yellow darken-2"></v-progress-linear>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="6" align="center">
        <h4>{{ msg }}</h4>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" v-if="processend">
      <v-col cols="6" align="center">
        <h3>정면</h3>
      </v-col>
      <v-col cols="6" align="center">
        <h3>측면</h3>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="6">
        <canvas id="canvasFront" />
      </v-col>
      <v-col cols="6">
        <canvas id="canvasSide" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import processimg from "../modules/processimg";
export default {
  data() {
    return {
      frontimg: undefined,
      frontwhr: undefined,
      sideimg: undefined,
      sidewhr: undefined,
      gender: undefined,
      tall: 170,
      kg: 60,
      bmi: 0,
      whr: 0,
      processend: false,
      active: false,
      msg: ""
    };
  },
  methods: {
    async onclick() {
      if (!this.frontimg && !this.sideimg) {
        this.msg = "선택된 사진이 없습니다.";
      } else if (!this.frontimg) {
        this.msg = "정면 사진이 없습니다.";
      } else if (!this.sideimg) {
        this.msg = "측면 사진이 없습니다.";
      } else if (!this.gender) {
        this.msg = "성별을 선택해주세요.";
      } else if (this.frontimg && this.sideimg && this.gender) {
        this.msg = "인공지능이 체형을 분석중입니다.";
        this.active = true;
        const canvasFront = document.getElementById("canvasFront");
        const canvasSide = document.getElementById("canvasSide");
        try {
          processimg(this.frontimg, canvasFront, result => {
            if (result.hipsize == 0) {
              this.msg = "(인식불가)하반신이 인식되지 않습니다.";
              this.active = false;
            }
            this.frontwhr = result.waistsize / result.hipsize;

            processimg(this.sideimg, canvasSide, result2 => {
              if (result.hipsize == 0) {
                this.msg = "(인식불가)하반신이 인식되지 않습니다.";
                this.active = false;
              }
              this.active = false;
              this.processend = true;
              this.sidewhr = result2.waistsize / result2.hipsize;
              this.bmi =
                this.kg / (((this.tall / 100) * this.tall) / 100).toFixed(2);
              this.whr = this.sidewhr * this.frontwhr;
              console.log("처리전", this.bmi, this.whr);
              if (this.gender == "여")
                this.bmi = this.bmi * (this.sidewhr * this.frontwhr + 0.15);
              else this.bmi = this.bmi * (this.sidewhr * this.frontwhr);
              this.bmi;
              console.log("처리후", this.bmi);

              if (this.bmi <= 18.5) {
                this.msg = this.bmi.toFixed(2) + " 저체중입니다";
              } else if (this.bmi < 23) {
                this.msg = this.bmi.toFixed(2) + " 정상입니다";
              } else if (this.bmi < 25) {
                this.msg = this.bmi.toFixed(2) + " 과체중입니다";
              } else if (this.bmi > 25) {
                this.msg = this.bmi.toFixed(2) + " 비만입니다";
              }
              // console.log(this.bmi, this.sidewhr * this.frontwhr);
            });

            console.log(1);
          });
        } catch (err) {
          this.msg = err;
        }
      }
    },
    resetdata() {
      this.frontimg = undefined;
      this.sideimg = undefined;
      this.frontwhr = undefined;
      this.sidewhr = undefined;
      this.gender = undefined;
      this.tall = 170;
      this.kg = 70;
      this.bmi = 0;
      this.whr = 0;
      this.processend = false;
      this.active = false;
      this.msg = "";

      var cnvs = document.getElementById("canvasFront");
      var ctx = cnvs.getContext("2d");

      ctx.clearRect(0, 0, cnvs.width, cnvs.height);
      ctx.beginPath();
      var cnvs = document.getElementById("canvasSide");
      var ctx = cnvs.getContext("2d");

      ctx.clearRect(0, 0, cnvs.width, cnvs.height);
      ctx.beginPath();
    }
  }
};
</script>
<style>
canvas {
  max-width: 100%;
  height: auto;
}
.noscroll {
  overflow: hidden;
  position: fixed;
  height: 100%;
  width: 100%;
}
</style>
