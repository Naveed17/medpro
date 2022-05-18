SHELL := /bin/bash

MEDPRO_SERVICE_NAME := medpro

REPO = $(CI_REGISTRY_IMAGE)

ifeq ($(REPO),)
    # Emulate docker-compose repo structure.
	REPO = $(shell basename $(CURDIR))_$(MEDPRO_SERVICE_NAME)
endif

ifeq ($(IMAGE_TAG),)
    IMAGE_TAG ?= latest
endif

.PHONY: all default build buildx check test pull push shell run start stop logs clean release

default: build

.EXPORT_ALL_VARIABLES:

build:
	docker build \
		$(PARAMS) \
		--cache-from $(REPO):$(IMAGE_TAG) \
		-t $(REPO):$(IMAGE_TAG) \
		--pull \
		./

buildx:
	docker buildx build \
		$(PARAMS) \
		--cache-from=type=registry,ref=$(REPO):$(IMAGE_TAG) \
		-t $(REPO):$(IMAGE_TAG) \
		--push \
		./

pull:
	-docker pull $(REPO):$(IMAGE_TAG)

push:
	docker push $(REPO):$(IMAGE_TAG)

clean:
	-docker rm -f $(NAME)

# Run build steps on CI.
ci.build: pull build push

# Get services URLs and docker-compose process status.
dcps:
	-$(eval MEDPRO_ID := $(shell docker-compose ps -q $(MEDPRO_SERVICE_NAME)))
	-$(eval MEDPRO_PORT := $(shell docker inspect $(MEDPRO_ID) --format='{{json (index (index .NetworkSettings.Ports "3000/tcp") 0).HostPort}}' 2> /dev/null))
	@echo $(MEDPRO_SERVICE_NAME): $(if $(MEDPRO_PORT), "http://localhost:$(MEDPRO_PORT)", "port not found.")

# New line before the ps.
	@echo
	@docker-compose ps -a

# Rebuild images, remove orphans, and docker-compose up.
dcupd:
	docker-compose up -d --build --remove-orphans

# Stop all runner containers.
dcstop:
	docker-compose stop

# Get core-api container logs.
dclogs:
	docker-compose logs --tail=100 -f $(MEDPRO_SERVICE_NAME)

# Get a bash inside running core-api container.
dcshell:
	docker-compose exec $(MEDPRO_SERVICE_NAME) bash

# Include the .d makefiles. The - at the front suppresses the errors of missing
# Include the .d makefiles.
-include makefiles.d
