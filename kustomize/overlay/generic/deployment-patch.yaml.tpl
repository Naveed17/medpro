apiVersion: apps/v1
kind: Deployment
metadata:
  name: med-pro
spec:
  replicas: 2
  selector:
    matchLabels:
      app: med-pro-${WORKSPACE}
      name: med-pro-${WORKSPACE}
  template:
    metadata:
    spec:
      containers:
        - env:
            - name: PORT
              value: "3000"
          imagePullPolicy: Always
          name: med-pro
      restartPolicy: Always
      terminationGracePeriodSeconds: 30