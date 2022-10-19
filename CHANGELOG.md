# [2.0.0](https://github.com/SmartMedSA/med-pro/compare/v1.0.1...v2.0.0) (2022-10-19)


### Bug Fixes

* .env.local.dist file ([37b412b](https://github.com/SmartMedSA/med-pro/commit/37b412b644e79b1fbf4677c29c4a76ab50f18d92))
* added missing env variable S3_MED_CORE ([d0e0c0b](https://github.com/SmartMedSA/med-pro/commit/d0e0c0bbc74893785bf854775cba1a966aca4b67))
* consultation sheet for patient without history ([65330bb](https://github.com/SmartMedSA/med-pro/commit/65330bb90296fb8fe12a5436e549524f1eaecfa0))
* end of consultation button ([64fb992](https://github.com/SmartMedSA/med-pro/commit/64fb992d82351324e73691c702cf24f9f6ca1c2f))
* fix popup on edit consultation and loading pages ([f90bb96](https://github.com/SmartMedSA/med-pro/commit/f90bb96da0ce820151f54ef108868af34e2d5840))
* mutate appointment data in consultation ([6f01880](https://github.com/SmartMedSA/med-pro/commit/6f0188074ce4db32856786cd4f748715f312cbb8))
* mutate documents from medical imaging results ([2892418](https://github.com/SmartMedSA/med-pro/commit/2892418ab392cbe4c01431a93c43da736584f87b))
* notification popover translation bug ([925c5de](https://github.com/SmartMedSA/med-pro/commit/925c5de997b25cb2161f61a37edcf10ef1d588c1))
* result medical imaging in patient hisoty appointements ([e29f7ce](https://github.com/SmartMedSA/med-pro/commit/e29f7cecee56e73568154c8cf219c9e3366721d7))
* set empty string if S3_MED_CORE env variable is undefined ([14a383c](https://github.com/SmartMedSA/med-pro/commit/14a383c140747b6d82127135cf94dd127394f9d3))
* stepper back action ([4b23271](https://github.com/SmartMedSA/med-pro/commit/4b2327122e367a0b7d6816403c5794ebebbd2b72))
* update .env file (FCM PAI KEY) ([68f6176](https://github.com/SmartMedSA/med-pro/commit/68f61760db5b30283b94fd9552666123e13451e1))
* update local dist next public variable ([6c75b5d](https://github.com/SmartMedSA/med-pro/commit/6c75b5d2cdefa6ecf0c926e894543e08428ad523))
* update navbar popover behavior ([c4ba947](https://github.com/SmartMedSA/med-pro/commit/c4ba947cb93cd327bcf331df5e23d5788150f2e7))


### Features

* add notification layout ([a9ef017](https://github.com/SmartMedSA/med-pro/commit/a9ef0177187938e1f3f98f48df579400bd4fe1aa))
* add notification popover ([4930db1](https://github.com/SmartMedSA/med-pro/commit/4930db14755a32cfc68d08be04b105a45e958627))
* edit patient from calendar stepper (add appointment) ([71deb74](https://github.com/SmartMedSA/med-pro/commit/71deb7436b9eead66a6729d21ebc8d5a7a44513d))
* fees acts quantity ([49d374d](https://github.com/SmartMedSA/med-pro/commit/49d374d18c95e724e92f42e073f7640445d64f7f))
* stop consultation popup ([41b95fc](https://github.com/SmartMedSA/med-pro/commit/41b95fc512c9765e86ea8cd4ffc83af422b0839e))
* upload medical imaging result ([452412a](https://github.com/SmartMedSA/med-pro/commit/452412a6add9e6081ab77f1a9fc46f524055f157))

# 1.0.0 (2022-10-13)


### Bug Fixes

* added missing copy instructions  dockerfile ([01db1dd](https://github.com/SmartMedSA/med-pro/commit/01db1dd1489814dbe420461b0249644319b869c0))
* added package-lock copy instruction ([55162be](https://github.com/SmartMedSA/med-pro/commit/55162be7660d3c7c7fdbfb615ace98c8dc717c89))
* dockerfile copy commands + Makefile commands ([fb04510](https://github.com/SmartMedSA/med-pro/commit/fb045101feff354ab8a94daf3a3d75a8cabdcde2))
* lintin step failing to find image ([b487573](https://github.com/SmartMedSA/med-pro/commit/b4875736b75048f0ef9cbabd6055ea0b53de7137))
* **Makefile:** add  --remove-orphans flag to dcdn ([d19859e](https://github.com/SmartMedSA/med-pro/commit/d19859e2f65a871b10d3bac41df76aa00b49df61))
* remove extra trigger branch ([acb2aa6](https://github.com/SmartMedSA/med-pro/commit/acb2aa61b7ca11f3ec2035dafac04bce8054a488))
* switch cache mode to REGISTRY + cache mode to MAX ([cc39ba0](https://github.com/SmartMedSA/med-pro/commit/cc39ba041c3e6b42b581bf3faa58bee4fd3b6e1b))
* **waypoint:** add ingress variable ([1a2a0b5](https://github.com/SmartMedSA/med-pro/commit/1a2a0b5167dee09a09b49ac45b7af6e452f2c54d))
* **waypoint:** default registry_secrets ([5449317](https://github.com/SmartMedSA/med-pro/commit/5449317e9fff0504ae99b8276b1920af806a6f02))
* **waypoint:** use new registry secrets ([6f93e8b](https://github.com/SmartMedSA/med-pro/commit/6f93e8b6f155c158adcb4bcf8e5d4af4f6e31241))


### Features

* added github workflow ([fffb90e](https://github.com/SmartMedSA/med-pro/commit/fffb90e79178c5c34830ac74f360eb59a3eac5c7))
* added waypoint demployment ([f55fd0c](https://github.com/SmartMedSA/med-pro/commit/f55fd0c946fb0bba4b763039c016ffbc3c6795cc))
* added waypoint workflow ([d2a41fd](https://github.com/SmartMedSA/med-pro/commit/d2a41fd8a9ebfefa2a4f0ed26bb6507329e903f4))
* caching docker build ([f9023ba](https://github.com/SmartMedSA/med-pro/commit/f9023bad70c75bdb56b3e5311957dd163cc41e49))
* **github:** use skaffold workflow instead of waypoint ([eb7d1a7](https://github.com/SmartMedSA/med-pro/commit/eb7d1a7e7e42165eea1ba827ef855becf0986d77))
* semantic release ([904493f](https://github.com/SmartMedSA/med-pro/commit/904493f0f5911190f698262e0b90682d33c0c91b))
* **semantic-release:** add releaserc ([8c6bd32](https://github.com/SmartMedSA/med-pro/commit/8c6bd3268fd98e1631a8f10eb8f1ed003596b7b5))
* **skaffold:** add build and deploy (kustomize) pipelines ([6c38063](https://github.com/SmartMedSA/med-pro/commit/6c38063ba0f7571f65635b60c2ac66d20770c8b8))
