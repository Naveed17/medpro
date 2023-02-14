resources:
  - ../../base
nameSuffix: -${WORKSPACE}
commonLabels:
  app: med-pro-${WORKSPACE}
  name: med-pro-${WORKSPACE}
  component: med-pro
patchesStrategicMerge:
  - deployment-patch.yaml
  - service-patch.yaml
  - ingress.yaml