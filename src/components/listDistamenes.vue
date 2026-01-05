<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card 
                    outlined
                    elevation="2"
                >
                    <v-toolbar flat dark :style="{ background: '#CC8400', color: 'white' }" class="justify-center">
                        <v-toolbar-title class="font-weight-bold text-center">
                            Lista de Dictámenes
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-data-table
                            :headers="headers"
                            :items="items"
                            item-key="id"
                            :search="search"
                        >
                            <template v-slot:top>
                                <v-row>
                                    <v-col class="d-flex justify-end" cols="3">
                                        <v-text-field 
                                            v-model="search" 
                                            label="Buscar" 
                                            dense 
                                            hide-details 
                                            prepend-inner-icon="mdi-magnify" 
                                            outlined>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-model="FechaInicio" label="Fecha Desde" outlined rounded readonly dense
                                                v-bind="attrs" v-on="on"></v-text-field>
                                            </template>
                                        <v-date-picker v-model="FechaInicio" no-title scrollable
                                            @input="changeFechaInicio()"></v-date-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-text-field v-model="FechaFin" label="Fecha Hasta" outlined rounded readonly dense></v-text-field>
                                    </v-col>
                                    <v-col class="d-flex justify-end" cols="3">
                                        <v-text-field 
                                            v-model="nroDictamenFind" 
                                            label="Nro Dictamen" 
                                            dense 
                                            hide-details 
                                            prepend-inner-icon="mdi-file-document" 
                                            outlined
                                            @keydown.enter="getDictamenes"
                                        >
                                        </v-text-field>
                                    </v-col>
                                    <v-col class="d-flex justify-start" cols="2">
                                        <v-btn 
                                            v-if="permisoCreacion"
                                            color="primary"
                                            @click="openDetail(3)"
                                        >
                                            <v-icon left>mdi-plus</v-icon>
                                            Agregar Dictamen
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </template>
                            <template v-slot:item.acciones="{ item }">
                                <v-btn icon color="primary" @click="openDetailShow(item)">
                                    <v-icon>mdi-magnify</v-icon>
                                </v-btn>
                                <v-btn v-if="permisoCreacion" icon color="primary" @click="openDetailEdit(item)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-menu bottom offset-y>
                                    <template v-slot:activator="{ on: menu, attrs }">
                                        <v-tooltip bottom>
                                        <template v-slot:activator="{ on: tooltip }">
                                            <v-btn
                                                :loading="loadingPDF"
                                                icon
                                                v-bind="attrs"
                                                v-on="{ ...tooltip, ...menu }"
                                            >
                                            <v-icon>mdi-file-pdf-box</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Exportar a PDF</span>
                                        </v-tooltip>
                                    </template>
                                    <v-list dense>
                                        <v-list-item @click="downloadDictamenPDF('Borrador', item.id, item.tipoDictamen)">
                                            <v-list-item-icon>
                                                <v-icon>mdi-file-pdf-box</v-icon>
                                            </v-list-item-icon>
                                            <v-list-item-content>
                                                <v-list-item-title>Borrador</v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-list-item @click="downloadDictamenPDF('Cliente', item.id, item.tipoDictamen)">
                                            <v-list-item-icon>
                                                <v-icon>mdi-file-pdf-box</v-icon>
                                            </v-list-item-icon>
                                            <v-list-item-content>
                                                <v-list-item-title>Cliente</v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-list-item @click="downloadDictamenPDF('Proveedor', item.id, item.tipoDictamen)">
                                            <v-list-item-icon>
                                                <v-icon>mdi-file-pdf-box</v-icon>
                                            </v-list-item-icon>
                                            <v-list-item-content>
                                                <v-list-item-title>Operador de Red</v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog
            v-model="openDetailDialog"
            max-width="600px"
        >
            <v-dialog
                v-model="openDetailDialog"
                max-width="1300"
                scrollable
                persistent
            >
                <v-card class="rounded-xl">
                    <!-- Header -->
                    <v-toolbar flat class="px-2" color="secondary">
                        <v-toolbar-title class="font-weight-bold white--text">
                            {{  "Nuevo dictamen" }}
                        </v-toolbar-title>

                        <v-spacer />

                        <v-btn icon @click="closeDetail()" color="white">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-divider />

                    <!-- Content -->
                    <v-card-text class="pt-6">
                        <v-stepper alt-labels v-model="stepMove">
                            <v-stepper-header>
                                <v-stepper-step
                                    step=1
                                >
                                    Tipo
                                </v-stepper-step>

                                <v-divider></v-divider>

                                <v-stepper-step
                                    step=2
                                >
                                    Organismo de Inspección
                                </v-stepper-step>

                                <v-divider></v-divider>

                                <v-stepper-step
                                    step=3
                                >
                                    Identificación de la Instalación
                                </v-stepper-step>

                                <v-divider></v-divider>

                                <v-stepper-step
                                    step=4
                                >
                                    Identificación de la Instalación objeto del dictamen
                                </v-stepper-step>
                                <v-divider></v-divider>

                                <v-stepper-step
                                    step=5
                                >
                                    Identificación de profesionales
                                </v-stepper-step>
                                <v-divider></v-divider>

                                <v-stepper-step
                                    step=6
                                >
                                    Evaluación
                                </v-stepper-step>
                                <v-divider></v-divider>

                                <v-stepper-step
                                    step=7
                                >
                                    Observaciones, Anexos y Resultado
                                </v-stepper-step>
                                <v-divider></v-divider>

                                <v-stepper-step
                                    step=8
                                >
                                    Firmas
                                </v-stepper-step>
                            </v-stepper-header>
                            <v-stepper-items>
                                <v-stepper-content step=1>
                                    <v-card
                                        background-color="secondary"
                                    >
                                        <v-card-title class="text-h4">
                                            Seleccione el Tipo de Dictamen
                                        </v-card-title>
                                        <v-card-text>
                                            <v-row>
                                                <v-col v-for="tipo in tiposDictamen" :key="tipo.id" cols="4">
                                                    <v-card
                                                        elevation="4"
                                                        rounded="3"
                                                        height="200"
                                                        class="selectable-card"
                                                        :class="{ 'selected-card': selectedTipo === tipo.id }"
                                                        @click.stop="selectTipo(tipo.id, tipo.tipo)"
                                                    >
                                                        <v-card-title>
                                                            Dictamen de {{ tipo.tipo }}
                                                            <v-spacer />
                                                            <v-btn icon>
                                                                <v-icon x-large dark :class="{ 'selected-icon': selectedTipo === tipo.id }">{{ tipo.icon }}</v-icon>
                                                            </v-btn>
                                                        </v-card-title>

                                                        <v-card-text :class="{ 'selected-subtitle': selectedTipo === tipo.id }">
                                                            {{ tipo.detalle }}
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </v-stepper-content>

                                <v-stepper-content step=2>
                                    <v-card
                                        outlined
                                        class="dictamen-card"
                                    >
                                        <!-- Header -->
                                        <div class="dictamen-header">
                                            <div class="d-flex align-center">
                                                <v-avatar
                                                    size="44"
                                                    color="primary"
                                                    class="mr-3"
                                                >
                                                    <v-icon dark>mdi-shield-outline</v-icon>
                                                </v-avatar>

                                                <div>
                                                    <div class="text-h6 font-weight-bold">
                                                        Dictamen de {{ selectedTipoNombre }}
                                                    </div>

                                                    <div class="d-flex align-center text-body-2 grey--text text--darken-1 mt-1">
                                                        <v-icon
                                                            small
                                                            class="mr-1"
                                                        >
                                                            mdi-file-document-outline
                                                        </v-icon>
                                                        <span>Anexo {{ nroAnexo }} - Resolución 40117 de 2024</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <v-chip
                                                color="primary"
                                                class="font-weight-medium"
                                                outlined
                                            >
                                                RETIE 2024
                                            </v-chip>
                                        </div>

                                        <!-- Fields -->
                                        <v-row dense>
                                            <v-col
                                                cols="2"
                                            >
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Número de Dictamen
                                                </div>
                                                <v-text-field
                                                    v-model="numero_dictamen"
                                                    placeholder="00-0001"
                                                    outlined
                                                    dense
                                                    readonly
                                                    hide-details
                                                />
                                            </v-col>

                                            <v-col
                                                cols="2"
                                            >
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Fecha de Expedición
                                                </div>
                                                <v-text-field 
                                                    v-model="fecha_expedicion" 
                                                    outlined 
                                                    rounded 
                                                    readonly 
                                                    dense 
                                                    hide-details 
                                                >
                                                </v-text-field>
                                            </v-col>

                                            <v-col
                                                cols="2"
                                            >
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Fecha de Inspección
                                                </div>
                                                <v-menu v-model="menu3" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field v-model="fecha_inspeccion" outlined rounded readonly dense hide-details
                                                        v-bind="attrs" v-on="on"></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="fecha_inspeccion" no-title scrollable @input="menu3 = false" :max="new Date().toISOString().substr(0, 10)"></v-date-picker>
                                                </v-menu>
                                            </v-col>

                                            <v-col
                                                cols="3"
                                            >
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Código de Expediente
                                                </div>
                                                <v-text-field
                                                    v-model="codigo_expediente"
                                                    placeholder="OCC-I-XXXX-XX"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                            
                                            <v-col
                                                cols="3"
                                            >
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Código de Verificacion
                                                </div>
                                                <v-text-field
                                                    v-model="codVerif"
                                                    placeholder="OCC-I-XXXX-XX"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                    <v-card
                                        outlined
                                        class="section-card"
                                    >
                                        <!-- Header -->
                                        <div class="section-header">
                                            <v-avatar
                                                size="40"
                                                color="primary"
                                                class="mr-3"
                                                rounded
                                            >
                                                <v-icon dark>mdi-office-building-outline</v-icon>
                                            </v-avatar>

                                            <div>
                                                <div class="text-subtitle-1 font-weight-bold">
                                                    Identificación del Organismo de Inspección
                                                </div>
                                            </div>
                                        </div>

                                        <div class="mt-4">
                                            <v-row dense>
                                                <v-col cols="6">
                                                    <div class="text-caption font-weight-medium mb-1">
                                                        Organismo de Inspección
                                                    </div>
                                                    <v-text-field
                                                        outlined
                                                        dense
                                                        hide-details
                                                        value="Organismo Colombiano de Certificación RETIE SAS"
                                                        readonly
                                                    />
                                                </v-col>
                                                <v-col cols="6" >
                                                    <div class="text-caption font-weight-medium mb-1">
                                                        Resolución de Acreditación
                                                    </div>
                                                    <v-text-field
                                                        outlined
                                                        dense
                                                        hide-details
                                                        value="17-OIN-037"
                                                        readonly
                                                    />
                                                </v-col>
                                            </v-row>
                                            <v-row dense>
                                                <v-col cols="6">
                                                    <div class="text-caption font-weight-medium mb-1">
                                                        NIT
                                                    </div>
                                                    <v-text-field
                                                        outlined
                                                        dense
                                                        hide-details
                                                        value="901058518-1"
                                                        readonly
                                                    />
                                                </v-col>
                                                <v-col cols="6">
                                                    <div class="text-caption font-weight-medium mb-1">
                                                        Teléfonos
                                                    </div>
                                                    <v-text-field
                                                        outlined
                                                        dense
                                                        hide-details
                                                        value="(607)6953122 - 3046060241"
                                                        readonly
                                                    />
                                                </v-col>
                                            </v-row>
                                            <v-row dense>
                                                <v-col cols="6">
                                                    <div class="text-caption font-weight-medium mb-1">
                                                        Dirección de Domicilio
                                                    </div>
                                                    <v-text-field
                                                        outlined
                                                        dense
                                                        hide-details
                                                        value="Calle 104 #21-155"
                                                        readonly
                                                    />
                                                </v-col>
                                                <v-col cols="6">
                                                    <div class="text-caption font-weight-medium mb-1">
                                                        Ciudad
                                                    </div>
                                                    <v-text-field
                                                        outlined
                                                        dense
                                                        hide-details
                                                        value="Bucaramanga"
                                                        readonly
                                                    />
                                                </v-col>
                                            </v-row>
                                        </div>
                                    </v-card>
                                </v-stepper-content>

                                <v-stepper-content step=3>
                                    <v-card
                                        outlined
                                        class="dictamen-card"
                                    >
                                        <!-- Header -->
                                        <div class="dictamen-header">
                                            <div class="d-flex align-center">
                                                <v-avatar
                                                    size="44"
                                                    color="primary"
                                                    class="mr-3"
                                                >
                                                    <v-icon dark>mdi-card-account-details-outline</v-icon>
                                                </v-avatar>

                                                <div>
                                                    <div class="text-h6 font-weight-bold">
                                                        Identificación de la instalación
                                                    </div>

                                                    <div class="d-flex align-center text-body-2 grey--text text--darken-1 mt-1">
                                                        <span>Datos de la instalación objeto de inspección</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Fields -->
                                        <v-row dense>
                                            <v-col cols="12">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Propietario de la Instalación
                                                </div>
                                                <v-text-field
                                                    v-model="propietario_instalacion"
                                                    placeholder="Nombre del propietario"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row dense>
                                            <v-col cols="12">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Nro de Documento
                                                </div>
                                                <v-text-field
                                                    type="number"
                                                    v-model="nro_documento"
                                                    placeholder="123456789"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row dense>
                                            <v-col cols="6">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Departamento
                                                </div>
                                                <v-autocomplete
                                                    v-model="departamento"
                                                    :items="departamentos"
                                                    item-text="NOMDEPTO"
                                                    item-value="CODIGODEPTO"
                                                    placeholder="Seleccione un departamento"
                                                    outlined
                                                    dense
                                                    hide-details
                                                    @change="getMunicipiosByDepto(departamento)"
                                                />
                                            </v-col>
                                            <v-col cols="6">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Dirección
                                                </div>
                                                <v-text-field
                                                    v-model="direccion"
                                                    placeholder="Dirección de la inspección"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row dense>
                                            <v-col cols="6">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Municipio
                                                </div>
                                                <v-autocomplete
                                                    v-model="municipio"
                                                    :items="municipios"
                                                    item-text="NOMCIUD"
                                                    item-value="CODIGO"
                                                    placeholder="Seleccione un municipio"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                            <v-col cols="6">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Barrio
                                                </div>
                                                <v-text-field
                                                    v-model="barrio"
                                                    placeholder="Nombre del barrio"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-stepper-content>

                                <v-stepper-content step=4>
                                    <v-card
                                        outlined
                                        class="dictamen-card"
                                    >
                                        <!-- Header -->
                                        <div class="dictamen-header">
                                            <div class="d-flex align-center">
                                                <v-avatar
                                                    size="44"
                                                    color="primary"
                                                    class="mr-3"
                                                >
                                                    <v-icon dark>mdi-office-building-marker</v-icon>
                                                </v-avatar>

                                                <div>
                                                    <div class="text-h6 font-weight-bold">
                                                        Identificación de la instalación objeto del dictamen
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Fields -->
                                        <v-row dense>
                                            <v-col cols="12">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Tipo de construcción
                                                </div>
                                                <v-autocomplete
                                                    v-model="tipo_construccion"
                                                    :items="tiposConstruccion"
                                                    item-text="nombre"
                                                    item-value="id"
                                                    placeholder="Seleccione un tipo de construcción"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row dense v-if="selectedTipo === 1">
                                            <v-col cols="4">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Localizacion
                                                </div>
                                                <v-text-field
                                                    v-model="localizacion"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                            <v-col cols="4">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Tensión [kV]
                                                </div>
                                                <v-text-field
                                                    type="number"
                                                    v-model="tension"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                            <v-col cols="4">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Capacidad [kVA]
                                                </div>
                                                <v-text-field
                                                    type="number"
                                                    v-model="capacidad"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row dense v-if="selectedTipo === 1 || selectedTipo === 3">
                                            <v-col cols="6">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Zona
                                                </div>
                                                <v-autocomplete
                                                    v-model="zona"
                                                    :items="zonas"
                                                    item-text="nombre"
                                                    item-value="id"
                                                    placeholder="Seleccione una zona"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                            <v-col cols="6">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Servicio
                                                </div>
                                                <v-autocomplete
                                                    v-model="servicio"
                                                    :items="servicios"
                                                    item-text="nombre"
                                                    item-value="id"
                                                    placeholder="Seleccione un servicio"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row dense v-if="selectedTipo === 1">
                                            <v-col cols="6">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Uso
                                                </div>
                                                <v-autocomplete
                                                    v-model="uso"
                                                    :items="usos"
                                                    item-text="nombre"
                                                    item-value="id"
                                                    placeholder="Seleccione un uso"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                            <v-col cols="6">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Tipo de configuración
                                                </div>
                                                <v-autocomplete
                                                    v-model="tipoConfiguracion"
                                                    :items="tiposConfig"
                                                    item-text="nombre"
                                                    item-value="id"
                                                    placeholder="Seleccione un tipo de configuración"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row dense v-if="selectedTipo === 1">
                                            <v-col cols="3">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Longitud (Km)
                                                </div>
                                                <v-text-field
                                                    type="number"
                                                    v-model="longitud"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                            <v-col cols="3">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Tipo y calibre de Conductores
                                                </div>
                                                <v-text-field
                                                    v-model="tipoConductores"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                            <v-col cols="3">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Material estructuras
                                                </div>
                                                <v-text-field
                                                    v-model="materialEstructuras"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                            <v-col cols="3">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Nro de estructuras de apoyo
                                                </div>
                                                <v-text-field
                                                    type="number"
                                                    v-model="nroEstructurasApoyo"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row dense v-if="selectedTipo === 2">
                                            <v-col cols="12">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Tipo de Proceso Asociado
                                                </div>
                                                <v-autocomplete
                                                    v-model="tipo_proceso_asoc"
                                                    :items="tiposProcesoAsoc"
                                                    item-text="nombre"
                                                    item-value="id"
                                                    placeholder="Seleccione un tipo de proceso asociado"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row dense v-if="selectedTipo === 2">
                                            <v-col cols="12">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Tipo de Subestación
                                                </div>
                                                <v-autocomplete
                                                    v-model="tipo_subestacion"
                                                    :items="tiposSubestacion"
                                                    item-text="nombre"
                                                    item-value="id"
                                                    placeholder="Seleccione un tipo de subestación"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row dense v-if="selectedTipo === 2">
                                            <v-col cols="12">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Tipo de Instalación
                                                </div>
                                                <v-autocomplete
                                                    v-model="tipo_instalacion"
                                                    :items="tiposInstalacion"
                                                    item-text="nombre"
                                                    item-value="id"
                                                    placeholder="Seleccione un tipo de instalación"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row dense v-if="selectedTipo === 2">
                                            <v-col cols="4">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Nro de Transformadores
                                                </div>
                                                <v-text-field
                                                    type="number"
                                                    v-model="nro_transformadores"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                            <v-col cols="4">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Tensión [kV]
                                                </div>
                                                <v-text-field
                                                    type="number"
                                                    v-model="tension"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                            <v-col cols="4">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Capacidad [kVA]
                                                </div>
                                                <v-text-field
                                                    type="number"
                                                    v-model="capacidad"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row dense v-if="selectedTipo === 3">
                                            <v-col cols="12">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Tipo de Uso Final
                                                </div>
                                                <v-autocomplete
                                                    v-model="tipo_uso_final"
                                                    :items="tiposUsoFinal"
                                                    item-text="nombre"
                                                    item-value="id"
                                                    placeholder="Seleccione un tipo de uso final"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row dense v-if="selectedTipo === 3">
                                            <v-col cols="12">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Subtipo de Instalación(es)
                                                </div>
                                                <v-text-field
                                                    v-model="subtipoInstalacion"
                                                    placeholder="Describa el subtipo de instalación(es)"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row dense v-if="selectedTipo === 3">
                                            <v-col cols="4">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Fases
                                                </div>
                                                <v-autocomplete
                                                    v-model="selectedFase"
                                                    :items="fases"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                            <v-col cols="4">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Tensión [kV]
                                                </div>
                                                <v-text-field
                                                    type="number"
                                                    v-model="tension"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                            <v-col cols="4">
                                                <div class="text-caption font-weight-medium mb-1">
                                                    Capacidad [kVA]
                                                </div>
                                                <v-text-field
                                                    type="number"
                                                    v-model="capacidad"
                                                    outlined
                                                    dense
                                                    hide-details
                                                />
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-stepper-content>

                                <v-stepper-content step=5>
                                    <v-card
                                        outlined
                                        class="dictamen-card"
                                    >
                                        <!-- Header -->
                                        <div class="dictamen-header">
                                            <div class="d-flex align-center">
                                                <v-avatar
                                                    size="44"
                                                    color="primary"
                                                    class="mr-3"
                                                >
                                                    <v-icon dark>mdi-account-tie</v-icon>
                                                </v-avatar>

                                                <div>
                                                    <div class="text-h6 font-weight-bold">
                                                        Identificación de profesionales competentes responsables
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Fields -->
                                        <v-row dense>
                                            <v-col cols="12">
                                                <v-expansion-panels accordion>
                                                    <v-expansion-panel>
                                                        <v-expansion-panel-header>Diseñador</v-expansion-panel-header>
                                                        <v-expansion-panel-content>
                                                            <v-row v-for="(item, index) in arrayDisenador" :key="index">
                                                                <v-col cols="4">
                                                                    <div class="text-caption font-weight-medium mb-1">
                                                                        Nombre
                                                                    </div>
                                                                    <v-text-field
                                                                        v-model="item.nombre"
                                                                        outlined
                                                                        dense
                                                                        hide-details
                                                                    />
                                                                </v-col>
                                                                <v-col cols="4">
                                                                    <div class="text-caption font-weight-medium mb-1">
                                                                        Profesion
                                                                    </div>
                                                                    <v-text-field
                                                                        v-model="item.Profesion"
                                                                        outlined
                                                                        dense
                                                                        hide-details
                                                                    />
                                                                </v-col>
                                                                <v-col cols="4">
                                                                    <div class="text-caption font-weight-medium mb-1">
                                                                        Matricula Prof.
                                                                    </div>
                                                                    <v-text-field
                                                                        v-model="item.matriculaProf"
                                                                        outlined
                                                                        dense
                                                                        hide-details
                                                                    />
                                                                </v-col>
                                                            </v-row>
                                                            <v-row>
                                                                <v-col cols="6" class="d-flex justify-start">
                                                                    <v-btn v-if="arrayDisenador.length > 1"
                                                                        color="primary"
                                                                        variant="outlined"
                                                                        @click="arrayDisenador.pop()"
                                                                    >
                                                                        Eliminar Diseñador
                                                                    </v-btn>
                                                                </v-col>
                                                                <v-col cols="6" class="d-flex justify-end">
                                                                    <v-btn
                                                                        color="primary"
                                                                        variant="outlined"
                                                                        @click="arrayDisenador.push({ id: arrayDisenador.length + 1, tipoProf: 'Diseñador', nombre: '', Profesion: '', matriculaProf: '' })"
                                                                    >
                                                                        Agregar Diseñador
                                                                    </v-btn>
                                                                </v-col>
                                                            </v-row>
                                                        </v-expansion-panel-content>
                                                    </v-expansion-panel>
                                                    <v-expansion-panel>
                                                        <v-expansion-panel-header>Constructor</v-expansion-panel-header>
                                                        <v-expansion-panel-content>
                                                            <v-row v-for="(item, index) in arrayConstructor" :key="index">
                                                                <v-col cols="4">
                                                                    <div class="text-caption font-weight-medium mb-1">
                                                                        Nombre
                                                                    </div>
                                                                    <v-text-field
                                                                        v-model="item.nombre"
                                                                        outlined
                                                                        dense
                                                                        hide-details
                                                                    />
                                                                </v-col>
                                                                <v-col cols="4">
                                                                    <div class="text-caption font-weight-medium mb-1">
                                                                        Profesion
                                                                    </div>
                                                                    <v-text-field
                                                                        v-model="item.Profesion"
                                                                        outlined
                                                                        dense
                                                                        hide-details
                                                                    />
                                                                </v-col>
                                                                <v-col cols="4">
                                                                    <div class="text-caption font-weight-medium mb-1">
                                                                        Matricula Prof.
                                                                    </div>
                                                                    <v-text-field
                                                                        v-model="item.matriculaProf"
                                                                        outlined
                                                                        dense
                                                                        hide-details
                                                                    />
                                                                </v-col>
                                                            </v-row> 
                                                            <v-row>
                                                                <v-col cols="6" class="d-flex justify-start">
                                                                    <v-btn v-if="arrayConstructor.length > 1"
                                                                        color="primary"
                                                                        variant="outlined"
                                                                        @click="arrayConstructor.pop()"
                                                                    >
                                                                        Eliminar Constructor
                                                                    </v-btn>
                                                                </v-col>
                                                                <v-col cols="6" class="d-flex justify-end">
                                                                    <v-btn
                                                                        color="primary"
                                                                        variant="outlined"
                                                                        @click="arrayConstructor.push({ id: arrayConstructor.length + 1, tipoProf: 'Constructor', nombre: '', Profesion: '', matriculaProf: '' })"
                                                                    >
                                                                        Agregar Constructor
                                                                    </v-btn>
                                                                </v-col>
                                                            </v-row>   
                                                        </v-expansion-panel-content>
                                                    </v-expansion-panel>
                                                    <v-expansion-panel>
                                                        <v-expansion-panel-header>Operador y Mantenedor</v-expansion-panel-header>
                                                        <v-expansion-panel-content>
                                                            <v-row v-for="(item, index) in arrayOperador" :key="index">
                                                                <v-col cols="4">
                                                                    <div class="text-caption font-weight-medium mb-1">
                                                                        Nombre
                                                                    </div>
                                                                    <v-text-field
                                                                        v-model="item.nombre"
                                                                        outlined
                                                                        dense
                                                                        hide-details
                                                                    />
                                                                </v-col>
                                                                <v-col cols="4">
                                                                    <div class="text-caption font-weight-medium mb-1">
                                                                        Profesion
                                                                    </div>
                                                                    <v-text-field
                                                                        v-model="item.Profesion"
                                                                        outlined
                                                                        dense
                                                                        hide-details
                                                                    />
                                                                </v-col>
                                                                <v-col cols="4">
                                                                    <div class="text-caption font-weight-medium mb-1">
                                                                        Matricula Prof.
                                                                    </div>
                                                                    <v-text-field
                                                                        v-model="item.matriculaProf"
                                                                        outlined
                                                                        dense
                                                                        hide-details
                                                                    />
                                                                </v-col>
                                                            </v-row>
                                                            <v-row>
                                                                <v-col cols="6" class="d-flex justify-start">
                                                                    <v-btn v-if="arrayOperador.length > 1"
                                                                        color="primary"
                                                                        variant="outlined"
                                                                        @click="arrayOperador.pop()"
                                                                    >
                                                                        Eliminar Operador
                                                                    </v-btn>
                                                                </v-col>
                                                                <v-col cols="6" class="d-flex justify-end">
                                                                    <v-btn
                                                                        color="primary"
                                                                        variant="outlined"
                                                                        @click="arrayOperador.push({ id: arrayOperador.length + 1, tipoProf: 'Operador', nombre: '', Profesion: '', matriculaProf: '' })"
                                                                    >
                                                                        Agregar Operador
                                                                    </v-btn>
                                                                </v-col>
                                                            </v-row>
                                                        </v-expansion-panel-content>
                                                    </v-expansion-panel>
                                                    <v-expansion-panel>
                                                        <v-expansion-panel-header>Interventor</v-expansion-panel-header>
                                                        <v-expansion-panel-content>
                                                            <v-row v-for="(item, index) in arrayInterventor" :key="index">
                                                                <v-col cols="4">
                                                                    <div class="text-caption font-weight-medium mb-1">
                                                                        Nombre
                                                                    </div>
                                                                    <v-text-field
                                                                        v-model="item.nombre"
                                                                        outlined
                                                                        dense
                                                                        hide-details
                                                                    />
                                                                </v-col>
                                                                <v-col cols="4">
                                                                    <div class="text-caption font-weight-medium mb-1">
                                                                        Profesion
                                                                    </div>
                                                                    <v-text-field
                                                                        v-model="item.Profesion"
                                                                        outlined
                                                                        dense
                                                                        hide-details
                                                                    />
                                                                </v-col>
                                                                <v-col cols="4">
                                                                    <div class="text-caption font-weight-medium mb-1">
                                                                        Matricula Prof.
                                                                    </div>
                                                                    <v-text-field
                                                                        v-model="item.matriculaProf"
                                                                        outlined
                                                                        dense
                                                                        hide-details
                                                                    />
                                                                </v-col>
                                                            </v-row>
                                                            <v-row>
                                                                <v-col cols="6" class="d-flex justify-start">
                                                                    <v-btn v-if="arrayInterventor.length > 1"
                                                                        color="primary"
                                                                        variant="outlined"
                                                                        @click="arrayInterventor.pop()"
                                                                    >
                                                                        Eliminar Interventor
                                                                    </v-btn>
                                                                </v-col>
                                                                <v-col cols="6" class="d-flex justify-end">
                                                                    <v-btn
                                                                        color="primary"
                                                                        variant="outlined"
                                                                        @click="arrayInterventor.push({ id: arrayInterventor.length + 1, tipoProf: 'Interventor', nombre: '', Profesion: '', matriculaProf: '' })"
                                                                    >
                                                                        Agregar Interventor
                                                                    </v-btn>
                                                                </v-col>
                                                            </v-row>
                                                        </v-expansion-panel-content>
                                                    </v-expansion-panel>
                                                </v-expansion-panels>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-stepper-content>

                                <v-stepper-content step=6>
                                    <v-card
                                        outlined
                                        class="dictamen-card"
                                    >
                                        <!-- Header -->
                                        <div class="dictamen-header">
                                            <div class="d-flex align-center">
                                                <v-avatar
                                                    size="44"
                                                    color="primary"
                                                    class="mr-3"
                                                >
                                                    <v-icon dark>mdi-list-status</v-icon>
                                                </v-avatar>

                                                <div>
                                                    <div class="text-h6 font-weight-bold">
                                                        Evaluación de la instalación eléctrica
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Fields -->
                                        <v-row dense>
                                            <v-col cols="12">
                                                <v-expansion-panels accordion>
                                                    <v-expansion-panel
                                                        v-for="(items, grupo) in groupedItems"
                                                        :key="grupo"
                                                    >
                                                        <v-expansion-panel-header>
                                                            {{ grupo }}
                                                        </v-expansion-panel-header>

                                                        <v-expansion-panel-content>
                                                            <v-card
                                                                v-for="item in items"
                                                                :key="item.id"
                                                                class="mb-4 pa-3"
                                                                outlined
                                                            >
                                                                <div class="font-weight-medium mb-2">
                                                                    {{ item.nombre }}
                                                                </div>

                                                                <v-row dense>
                                                                    <!-- Aplica -->
                                                                    <v-col cols="12" md="3">
                                                                        <v-autocomplete
                                                                            label="Aplica"
                                                                            :items="[{ text: 'Sí', value: true },{ text: 'No', value: false }]"
                                                                            item-text="text"
                                                                            item-value="value"
                                                                            dense
                                                                            outlined
                                                                            v-model="item.aplica"
                                                                            @change="onAplicaChange(item)"
                                                                        />
                                                                    </v-col>

                                                                    <!-- Parámetro medido -->
                                                                    <v-col cols="12" md="3">
                                                                        <v-text-field
                                                                            label="Parámetro medido"
                                                                            dense
                                                                            outlined
                                                                            :disabled="item.aplica === 'No'"
                                                                            v-model="item.parametroMedido"
                                                                        />
                                                                    </v-col>

                                                                    <!-- Parámetro referencia -->
                                                                    <v-col cols="12" md="3">
                                                                        <v-text-field
                                                                            label="Parámetro referencia"
                                                                            dense
                                                                            outlined
                                                                            :disabled="item.aplica === 'No'"
                                                                            v-model="item.parametroReferencia"
                                                                        />
                                                                    </v-col>

                                                                    <!-- Cumple -->
                                                                    <v-col cols="12" md="3">
                                                                        <v-autocomplete
                                                                            label="Cumple"
                                                                            :items="[{ text: 'Sí', value: true },{ text: 'No', value: false }]"
                                                                            item-text="text"
                                                                            item-value="value"
                                                                            dense
                                                                            outlined
                                                                            v-model="item.cumple"
                                                                        />
                                                                    </v-col>
                                                                </v-row>
                                                            </v-card>
                                                        </v-expansion-panel-content>
                                                    </v-expansion-panel>
                                                </v-expansion-panels>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-stepper-content>

                                <v-stepper-content step="7">
                                    <v-card
                                        outlined
                                        class="dictamen-card"
                                    >
                                        <!-- Header -->
                                        <div class="dictamen-header">
                                            <div class="d-flex align-center">
                                                <v-avatar
                                                    size="44"
                                                    color="primary"
                                                    class="mr-3"
                                                >
                                                    <v-icon dark>mdi-check-underline-circle-outline</v-icon>
                                                </v-avatar>

                                                <div>
                                                    <div class="text-h6 font-weight-bold">
                                                        Resultado de la Inspección
                                                    </div>

                                                    <div class="d-flex align-center text-body-2 grey--text text--darken-1 mt-1">
                                                        <v-icon
                                                            small
                                                            class="mr-1"
                                                        >
                                                            mdi-file-document-outline
                                                        </v-icon>
                                                        <span>Observaciones, modificaciones y resultado final</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Fields -->
                                        <v-card-text>
                                            <v-row>
                                                <v-col v-for="resultado in tiposResultado" :key="resultado.id" cols="6">
                                                    <v-card
                                                        elevation="4"
                                                        rounded="3"
                                                        height="120"
                                                        elevation-hover="6"
                                                        class="selectable-card"
                                                        :class="(selectedResultadoValue === true && selectedResultadoId === resultado.id) ? 'selected-card-result-true' : (selectedResultadoValue === false && selectedResultadoId === resultado.id) ? 'selected-card-result-false' : '' "
                                                        @click.stop="selectResult(resultado.value, resultado.id)"
                                                    >
                                                        <v-card-title>
                                                            {{ resultado.tipo }}
                                                            <v-spacer />
                                                            <v-btn icon>
                                                                <v-icon x-large dark :class="(selectedResultadoValue === true && selectedResultadoId === resultado.id) ? 'selected-card-icon-result-true' : (selectedResultadoValue === false && selectedResultadoId === resultado.id) ? 'selected-card-icon-result-false' : '' ">{{ resultado.icon }}</v-icon>
                                                            </v-btn>
                                                        </v-card-title>

                                                        <v-card-text class="text-body-2">
                                                            {{ resultado.detalle }}
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                            </v-row>
                                            <v-row dense>
                                                <v-col cols="12">
                                                    <div class="text-caption font-weight-medium mb-1">
                                                        Observaciones, modificaciones y advertencias especiales
                                                    </div>
                                                    <v-textarea
                                                        v-model="observaciones"
                                                        outlined
                                                        dense
                                                        rows="6"
                                                        maxlength="255"
                                                        hide-details
                                                    />
                                                </v-col>
                                            </v-row>
                                            <!-- <v-row dense>
                                                <v-col cols="12">
                                                    <div class="text-caption font-weight-medium mb-1">
                                                        Modificaciones
                                                    </div>
                                                    <v-textarea
                                                        v-model="modificaciones"
                                                        outlined
                                                        dense
                                                        rows="3"
                                                        maxlength="255"
                                                        hide-details
                                                    />
                                                </v-col>
                                            </v-row>
                                            <v-row dense>
                                                <v-col cols="12">
                                                    <div class="text-caption font-weight-medium mb-1">
                                                        Advertencias Especiales
                                                    </div>
                                                    <v-textarea
                                                        v-model="advertenciasEsp"
                                                        outlined
                                                        dense
                                                        rows="3"
                                                        maxlength="255"
                                                        hide-details
                                                    />
                                                </v-col>
                                            </v-row> -->
                                            <v-row dense>
                                                <v-col cols="12">
                                                    <div class="text-caption font-weight-medium mb-1">
                                                        Anexos
                                                    </div>
                                                    <v-textarea
                                                        v-model="anexos"
                                                        outlined
                                                        dense
                                                        rows="3"
                                                        maxlength="255"
                                                        hide-details
                                                    />
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </v-stepper-content>

                                <v-stepper-content step="8">
                                    <v-card
                                        outlined
                                        class="dictamen-card"
                                    >
                                        <!-- Header -->
                                        <div class="dictamen-header">
                                            <div class="d-flex align-center">
                                                <v-avatar
                                                    size="44"
                                                    color="primary"
                                                    class="mr-3"
                                                >
                                                    <v-icon dark>mdi-signature</v-icon>
                                                </v-avatar>

                                                <div>
                                                    <div class="text-h6 font-weight-bold">
                                                        Firmas del documento
                                                    </div>

                                                    <div class="d-flex align-center text-body-2 grey--text text--darken-1 mt-1">
                                                        <v-icon
                                                            small
                                                            class="mr-1"
                                                        >
                                                            mdi-file-document-outline
                                                        </v-icon>
                                                        <span>Datos de los profesionales que firman el documento</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Fields -->
                                        <v-card-text>
                                            <v-row dense>
                                                <v-col cols="12">
                                                    <v-expansion-panels accordion>
                                                        <v-expansion-panel>
                                                            <v-expansion-panel-header>Director Técnico del organismo de inspección</v-expansion-panel-header>
                                                            <v-expansion-panel-content>
                                                                <v-row>
                                                                    <v-col cols="12">
                                                                        <div class="text-caption font-weight-medium mb-1">
                                                                            Nombre
                                                                        </div>
                                                                        <v-text-field
                                                                            v-model="nombre_dt"
                                                                            outlined
                                                                            dense
                                                                            hide-details
                                                                        />
                                                                    </v-col>
                                                                </v-row>
                                                                <v-row>
                                                                    <v-col cols="6">
                                                                        <div class="text-caption font-weight-medium mb-1">
                                                                            No. de Documento de identificación
                                                                        </div>
                                                                        <v-text-field
                                                                            v-model="nroDcto_dt"
                                                                            outlined
                                                                            dense
                                                                            hide-details
                                                                        />
                                                                    </v-col>
                                                                    <v-col cols="6">
                                                                        <div class="text-caption font-weight-medium mb-1">
                                                                            Profesión
                                                                        </div>
                                                                        <v-text-field
                                                                            v-model="profesion_dt"
                                                                            outlined
                                                                            dense
                                                                            hide-details
                                                                        />
                                                                    </v-col>
                                                                </v-row>
                                                                <v-row>
                                                                    <v-col cols="6">
                                                                        <div class="text-caption font-weight-medium mb-1">
                                                                            Certificado de Competencias
                                                                        </div>
                                                                        <v-text-field
                                                                            v-model="certComp_dt"
                                                                            outlined
                                                                            dense
                                                                            hide-details
                                                                        />
                                                                    </v-col>
                                                                    <v-col cols="6">
                                                                        <div class="text-caption font-weight-medium mb-1">
                                                                            Matricula Prof.
                                                                        </div>
                                                                        <v-text-field
                                                                            v-model="matrProf_dt"
                                                                            outlined
                                                                            dense
                                                                            hide-details
                                                                        />
                                                                    </v-col>
                                                                </v-row>
                                                                <v-row>
                                                                    <v-col cols="12">
                                                                        <div class="text-caption font-weight-medium mb-1">
                                                                            Firma y Sello
                                                                        </div>
                                                                        <v-text-field
                                                                            outlined
                                                                            dense
                                                                            hide-details
                                                                        />
                                                                    </v-col>
                                                                </v-row>
                                                            </v-expansion-panel-content>
                                                        </v-expansion-panel>
                                                        <v-expansion-panel>
                                                            <v-expansion-panel-header>Inspector</v-expansion-panel-header>
                                                            <v-expansion-panel-content>
                                                                <v-row>
                                                                    <v-col cols="12">
                                                                        <div class="text-caption font-weight-medium mb-1">
                                                                            Nombre
                                                                        </div>
                                                                        <v-text-field
                                                                            v-model="nombre_insp"
                                                                            outlined
                                                                            dense
                                                                            hide-details
                                                                        />
                                                                    </v-col>
                                                                </v-row>
                                                                <v-row>
                                                                    <v-col cols="6">
                                                                        <div class="text-caption font-weight-medium mb-1">
                                                                            No. de Documento de identificación
                                                                        </div>
                                                                        <v-text-field
                                                                            v-model="nroDcto_insp"
                                                                            outlined
                                                                            dense
                                                                            hide-details
                                                                        />
                                                                    </v-col>
                                                                    <v-col cols="6">
                                                                        <div class="text-caption font-weight-medium mb-1">
                                                                            Profesión
                                                                        </div>
                                                                        <v-text-field
                                                                            v-model="profesion_insp"
                                                                            outlined
                                                                            dense
                                                                            hide-details
                                                                        />
                                                                    </v-col>
                                                                </v-row>
                                                                <v-row>
                                                                    <v-col cols="6">
                                                                        <div class="text-caption font-weight-medium mb-1">
                                                                            Certificado de Competencias
                                                                        </div>
                                                                        <v-text-field
                                                                            v-model="certComp_insp"
                                                                            outlined
                                                                            dense
                                                                            hide-details
                                                                        />
                                                                    </v-col>
                                                                    <v-col cols="6">
                                                                        <div class="text-caption font-weight-medium mb-1">
                                                                            Matricula Prof.
                                                                        </div>
                                                                        <v-text-field
                                                                            v-model="matrProf_insp"
                                                                            outlined
                                                                            dense
                                                                            hide-details
                                                                        />
                                                                    </v-col>
                                                                </v-row>
                                                                <v-row>
                                                                    <v-col cols="12">
                                                                        <div class="text-caption font-weight-medium mb-1">
                                                                            Firma y Sello
                                                                        </div>
                                                                        <v-text-field
                                                                            outlined
                                                                            dense
                                                                            hide-details
                                                                        />
                                                                    </v-col>
                                                                </v-row>
                                                            </v-expansion-panel-content>
                                                        </v-expansion-panel>
                                                    </v-expansion-panels>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </v-stepper-content>
                            </v-stepper-items>
                        </v-stepper>
                    </v-card-text>

                    <v-divider />

                    <!-- Footer -->
                    <v-card-actions class="pa-4">
                        <v-btn
                            variant="text"
                            :disabled="stepMove === 1"
                            @click="stepMove = parseInt(stepMove) - 1"
                        >
                            Atrás
                        </v-btn>

                        <v-spacer />

                        <v-btn
                            color="primary"
                            variant="elevated"
                            @click="nextStep()"
                            :disabled="modo === 1 && stepMove === 8"
                        >
                            {{ stepMove < 8 ? "Continuar" : modo === 2 ? "Guardar Cambios" : "Crear Dictamen" }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </v-dialog>
    </v-container>
</template>

<script>
import dictamenService from '@/services/dictamenService'
import snackbarService from '@/utils/snackbar.service'
import municipioService from '@/services/municipios'
import loadingService from '@/utils/loadingService'
import { hasRole } from '@/utils/roles'
import moment from 'moment'

export default {
    name: 'ListDictamenes',
    data() {
        return {
            //Dictamen
            headers: [
                { text: 'Dictamen', value: 'nroDictamen' },
                { text: 'Fecha Exp', value: 'fechaExpedicion' },
                { text: 'Expediente', value: 'codExpediente' },
                { text: 'Propietario', value: 'datosGenerales.nombreProp' },
                { text: 'Documento', value: 'datosGenerales.docProp' },
                { text: 'Departamento', value: 'datosGenerales.municipio.NOMDEPTO' },
                { text: 'Ciudad', value: 'datosGenerales.municipio.NOMCIUD' },
                { text: 'Tipo Dictamen', value: 'tipoDict.tipo' },
                { text: 'Acciones', value: 'acciones', sortable: false }
            ],
            items: [],
            search: '',
            FechaInicio: null,
            FechaFin: new Date().toISOString().substr(0, 10),
            nroDictamenFind: '',
            menu: false,
            openDetailDialog: false,
            selectedDictamen: null,
            loadingPDF: false,
            // Detail Dictamen
            stepMove: 1,
            //Step 1
            selectedTipo: null,
            selectedTipoNombre: '',
            tiposDictamen: [],
            //Step 2
            numero_dictamen: '',
            fecha_expedicion: '',
            menu2: false,
            fecha_inspeccion: '',
            menu3: false,
            codigo_expediente: '',
            codVerif: '',
            //Step 3
            propietario_instalacion: '',
            nro_documento: '',
            departamentos: [],
            departamento: '',
            municipios: [],
            municipio: '',
            direccion: '',
            barrio: '',
            //Step 4
            tiposConstruccion: [],
            tipo_construccion: null,
            localizacion: '',
            tension: '',
            capacidad: '',
            zonas: [],
            zona: null,
            servicios: [],
            servicio: null,
            usos: [],
            uso: null,
            tiposConfig: [],
            tipoConfiguracion: null,
            longitud: '',
            tipoConductores: '',
            materialEstructuras: '',
            nroEstructurasApoyo: '',
            nro_transformadores: '',
            tiposProcesoAsoc: [],
            tiposSubestacion: [],
            tiposInstalacion: [],
            tiposUsoFinal: [],
            tipo_proceso_asoc: null,
            tipo_subestacion: null,
            tipo_instalacion: null,
            tipo_uso_final: null,
            subtipoInstalacion: '',
            fases: [1,2,3],
            selectedFase: null,
            //Step 5
            arrayDisenador: [
                {
                    id: 1,
                    tipoProf: 'Diseñador',
                    nombre: '',
                    Profesion: '',
                    matriculaProf: ''
                },
            ],
            arrayConstructor: [
                {
                    id: 1,
                    tipoProf: 'Constructor',
                    nombre: '',
                    Profesion: '',
                    matriculaProf: ''
                },
            ],
            arrayOperador: [
                {
                    id: 1,
                    tipoProf: 'Operador',
                    nombre: '',
                    Profesion: '',
                    matriculaProf: ''
                },
            ],
            arrayInterventor: [
                {
                    id: 1,
                    tipoProf: 'Interventor',
                    nombre: '',
                    Profesion: '',
                    matriculaProf: ''
                },
            ],
            //Step 6
            evaluaciones: [],
            //Step 7
            tiposResultado: [
                { id: 1, tipo: 'Aprobada', icon: 'mdi-check-circle-outline', detalle: 'La instalación cumple con todos los requisitos establecidos.', value: true },
                { id: 2, tipo: 'No Aprobada', icon: 'mdi-close-circle-outline', detalle: 'La instalación no cumple con los requisitos establecidos.', value: false }
            ],
            selectedResultadoValue: null,
            selectedResultadoId: null,
            observaciones: '',
            modificaciones: '',
            advertenciasEsp: '',
            anexos: '',
            //Step 8
            nombre_dt: '',
            nroDcto_dt: '',
            profesion_dt: '',
            certComp_dt: '',
            matrProf_dt: '',
            nombre_insp: '',
            nroDcto_insp: '',
            profesion_insp: '',
            certComp_insp: '',
            matrProf_insp: '',

            //Data Detail Show and Edit
            dictamenDetail: {},
            modo: 1 //1: Show, 2: Edit
        }
    },
    mounted() {
        this.Calculate_Fecha_inicio()
        this.getDictamenes()
    },
    methods: {
        async getDictamenes() {
            try {
                loadingService.show('Cargando dictámenes...')
                this.items = await dictamenService.getDictamenes({
                    FechaInicio: this.FechaInicio,
                    FechaFin: this.FechaFin,
                    nroDictamen: this.nroDictamenFind
                })
            } catch (error) {
                console.error('Error fetching dictámenes:', error)
            } finally {
                loadingService.hide()
            }
        },
        changeFechaInicio() {
            this.nroDictamenFind = ''
            const fecha2 = new Date(this.FechaInicio)
            fecha2.setDate(fecha2.getDate() + 30)
            this.FechaFin = fecha2.toISOString().substring(0, 10)
            this.menu = false
            this.getDictamenes()
        },
        Calculate_Fecha_inicio() {
            const fecha = new Date()
            fecha.setDate(fecha.getDate() - 30)
            this.FechaInicio = fecha.toISOString().substring(0, 10)
        },
        async openDetail(modo) {
            this.modo = modo
            try {
                loadingService.show('Cargando dictamen...')

                // Peticiones comunes (siempre)
                const requests = [
                    this.getTiposDictamen(),
                    this.getDepartamentos(),
                    this.getTiposConstruccion(),
                    this.getZonas(),
                    this.getServicios(),
                    this.getUsos(),
                    this.getTiposConfig(),
                    this.getTiposProcesoAsoc(),
                    this.getTiposSubestacion(),
                    this.getTiposInstalacion(),
                    this.getTiposUsoFinal()
                ]

                // Peticiones solo en modo CREATE
                if (modo === 3) {
                    this.fecha_expedicion = moment().format('YYYY-MM-DD')

                    requests.push(
                        this.getNroDictamen(),
                        this.getEvaluaciones()
                    )
                }

                await Promise.all(requests)


            } catch (error) {
                console.error('Error cargando datos del dictamen:', error)
            } finally {
                this.openDetailDialog = true
                loadingService.hide()
            }
        },
        closeDetail() {
            this.openDetailDialog = false
            this.cleanUpCampos()
        },
        selectTipo(tipoId, nombreTipo) {
            this.selectedTipo = tipoId
            this.selectedTipoNombre = nombreTipo
        },
        selectResult(resultadoValue, resultadoId) {
            this.selectedResultadoValue = resultadoValue
            this.selectedResultadoId = resultadoId
        },
        nextStep() {
            const validaciones = this.validaciones()
            if (validaciones) {
                if (parseInt(this.stepMove) < 8) {
                    this.stepMove = parseInt(this.stepMove) + 1
                } else if (this.modo === 2) {
                    this.updateDictamen(this.selectedDictamen)
                } else {
                    this.createDictamen()
                }
            }
        },
        async getTiposDictamen() {
            try {
                const tipos = await dictamenService.getTiposDictamen()
                this.tiposDictamen = tipos
                return tipos
            } catch (error) {
                console.error('Error fetching tipos de dictamen:', error)
                throw error
            }
        },
        async getTiposConstruccion() {
            try {
                const tipos = await dictamenService.getTiposConstruccion()
                this.tiposConstruccion = tipos
                return tipos
            } catch (error) {
                console.error('Error fetching tipos de construcción:', error)
                throw error
            }
        },
        async getZonas() {
            try {
                const zonas = await dictamenService.getZonas()
                this.zonas = zonas
                return zonas
            } catch (error) {
                console.error('Error fetching zonas:', error)
                throw error
            }
        },
        async getServicios() {
            try {
                const servicios = await dictamenService.getServicios()
                this.servicios = servicios
                return servicios
            } catch (error) {
                console.error('Error fetching servicios:', error)
                throw error
            }
        },
        async getUsos() {
            try {
                const usos = await dictamenService.getUsos()
                this.usos = usos
                return usos
            } catch (error) {
                console.error('Error fetching usos:', error)
                throw error
            }
        },
        async getTiposConfig() {
            try {
                const tiposConfig = await dictamenService.getTiposConfig()
                this.tiposConfig = tiposConfig
                return tiposConfig
            } catch (error) {
                console.error('Error fetching tipos de configuración:', error)
                throw error
            }
        },
        async getTiposProcesoAsoc() {
            try {
                const tipos = await dictamenService.getTiposProcesoAsoc()
                this.tiposProcesoAsoc = tipos
                return tipos
            } catch (error) {
                console.error('Error fetching tipos de proceso asociado:', error)
                throw error
            }
        },
        async getTiposSubestacion() {
            try {
                const tipos = await dictamenService.getTiposSubestacion()
                this.tiposSubestacion = tipos
                return tipos
            } catch (error) {
                console.error('Error fetching tipos de subestación:', error)
                throw error
            }
        },
        async getTiposInstalacion() {
            try {
                const tipos = await dictamenService.getTiposInstalacion()
                this.tiposInstalacion = tipos
                return tipos
            } catch (error) {
                console.error('Error fetching tipos de instalación:', error)
                throw error
            }
        },
        async getTiposUsoFinal() {
            try {
                const tipos = await dictamenService.getTiposUsoFinal()
                this.tiposUsoFinal = tipos
                return tipos
            } catch (error) {
                console.error('Error fetching tipos de uso final:', error)
                throw error
            }
        },
        async getEvaluaciones() {
            try {
                const evaluaciones = await dictamenService.getEvaluaciones()
                this.evaluaciones = evaluaciones.map(item => ({
                    ...item,
                    aplica: null,
                    parametroMedido: '',
                    parametroReferencia: '',
                    cumple: null
                }))
                return this.evaluaciones
            } catch (error) {
                console.error('Error fetching evaluaciones:', error)
                throw error
            }
        },
        async getNroDictamen() {
            try {
                const nroDictamen = await dictamenService.getNroDictamen()
                this.numero_dictamen = nroDictamen.nroDictamen
                return nroDictamen
            } catch (error) {
                console.error('Error fetching número de dictamen:', error)
                throw error
            }
        },
        async getDepartamentos() {
            try {
                const departamentos = await municipioService.getDepartamentos()
                this.departamentos = departamentos
                return departamentos
            } catch (error) {
                console.error('Error fetching departamentos:', error)
                throw error
            }
        },
        async getMunicipiosByDepto(departamento) {
            try {
                loadingService.show('Cargando municipios...')
                const municipios = await municipioService.getMunicipiosByDepto(departamento)
                this.municipios = municipios
            } catch (error) {
                console.error('Error fetching municipios:', error)
            } finally {
                loadingService.hide()
            }
        },
        async createDictamen() {
            try {
                loadingService.show('Creando dictamen...')
                const newDictamen = {
                    tipoDictamen: this.selectedTipo,
                    fechaExpedicion: this.fecha_expedicion,
                    fechaInspeccion: this.fecha_inspeccion,
                    codExpediente: this.codigo_expediente,
                    codVerif: this.codVerif,
                    nroDictamen: this.numero_dictamen,
                    datosGenerales: {
                        docProp: this.nro_documento,
                        nombreProp: this.propietario_instalacion,
                        codDepto: this.departamento,
                        codMuni: this.municipio,
                        address: this.direccion,
                        barrio: this.barrio
                    },
                    dictamenParteC: {
                        tipoConstruccion: this.tipo_construccion,
                        localizacion: this.localizacion,
                        tension: this.tension,
                        capacidad: this.capacidad,
                        zona: this.zona,
                        servicio: this.servicio,
                        uso: this.uso,
                        tipoconfiguracion: this.tipoConfiguracion,
                        longitud: this.longitud,
                        tipoConductores: this.tipoConductores,
                        materialEstructuras: this.materialEstructuras,
                        estructurasApoyo: this.nroEstructurasApoyo,
                        tipoProcesoAsoc: this.tipo_proceso_asoc,
                        tipoSubestacion: this.tipo_subestacion,
                        tipoInstalacion: this.tipo_instalacion,
                        nroTransformadores: this.nro_transformadores,
                        tipoUsoFinal: this.tipo_uso_final,
                        subtipoInstalacion: this.subtipoInstalacion,
                        fases: this.selectedFase
                    },
                    dictamenParteD: {
                        arrayDisenador: this.arrayDisenador,
                        arrayConstructor: this.arrayConstructor,
                        arrayOperador: this.arrayOperador,
                        arrayInterventor: this.arrayInterventor
                    },
                    dictamenParteE: {
                        evaluaciones: this.evaluaciones
                    },
                    dictamenParteF: {
                        resultado: this.selectedResultadoValue,
                        observaciones: this.observaciones,
                        modificaciones: this.modificaciones,
                        advertenciasEsp: this.advertenciasEsp,
                        anexos: this.anexos
                    },
                    dictamenParteH: {
                        nombre_dt: this.nombre_dt,
                        nroDcto_dt: this.nroDcto_dt,
                        profesion_dt: this.profesion_dt,
                        certComp_dt: this.certComp_dt,
                        matrProf_dt: this.matrProf_dt,
                        nombre_insp: this.nombre_insp,
                        nroDcto_insp: this.nroDcto_insp,
                        profesion_insp: this.profesion_insp,
                        certComp_insp: this.certComp_insp,
                        matrProf_insp: this.matrProf_insp

                    }
                }
                await dictamenService.createDictamen(newDictamen)
            } catch (error) {
                console.error('Error creating dictamen:', error)
            } finally {
                loadingService.hide()
                this.updateNroDictamen(this.numero_dictamen)
                this.cleanUpCampos()
                this.closeDetail()
                this.getDictamenes()
            }
        },
        async updateDictamen(itemId) {
            try {
                loadingService.show('Actualizando número de dictamen...')            
                const dataDictamen = {
                    tipoDictamen: this.selectedTipo,
                    fechaExpedicion: this.fecha_expedicion,
                    fechaInspeccion: this.fecha_inspeccion,
                    codExpediente: this.codigo_expediente,
                    codVerif: this.codVerif,
                    nroDictamen: this.numero_dictamen,
                    datosGenerales: {
                        docProp: this.nro_documento,
                        nombreProp: this.propietario_instalacion,
                        codDepto: this.departamento,
                        codMuni: this.municipio,
                        address: this.direccion,
                        barrio: this.barrio
                    },
                    dictamenParteC: {
                        tipoConstruccion: this.tipo_construccion,
                        localizacion: this.localizacion,
                        tension: this.tension,
                        capacidad: this.capacidad,
                        zona: this.zona,
                        servicio: this.servicio,
                        uso: this.uso,
                        tipoconfiguracion: this.tipoConfiguracion,
                        longitud: this.longitud,
                        tipoConductores: this.tipoConductores,
                        materialEstructuras: this.materialEstructuras,
                        estructurasApoyo: this.nroEstructurasApoyo,
                        tipoProcesoAsoc: this.tipo_proceso_asoc,
                        tipoSubestacion: this.tipo_subestacion,
                        tipoInstalacion: this.tipo_instalacion,
                        nroTransformadores: this.nro_transformadores,
                        tipoUsoFinal: this.tipo_uso_final,
                        subtipoInstalacion: this.subtipoInstalacion,
                        fases: this.selectedFase
                    },
                    dictamenParteD: {
                        arrayDisenador: this.arrayDisenador,
                        arrayConstructor: this.arrayConstructor,
                        arrayOperador: this.arrayOperador,
                        arrayInterventor: this.arrayInterventor
                    },
                    dictamenParteE: {
                        evaluaciones: this.evaluaciones
                    },
                    dictamenParteF: {
                        resultado: this.selectedResultadoValue,
                        observaciones: this.observaciones,
                        modificaciones: this.modificaciones,
                        advertenciasEsp: this.advertenciasEsp,
                        anexos: this.anexos
                    },
                    dictamenParteH: {
                        nombre_dt: this.nombre_dt,
                        nroDcto_dt: this.nroDcto_dt,
                        profesion_dt: this.profesion_dt,
                        certComp_dt: this.certComp_dt,
                        matrProf_dt: this.matrProf_dt,
                        nombre_insp: this.nombre_insp,
                        nroDcto_insp: this.nroDcto_insp,
                        profesion_insp: this.profesion_insp,
                        certComp_insp: this.certComp_insp,
                        matrProf_insp: this.matrProf_insp

                    }
                }
                await dictamenService.updateDictamen(dataDictamen, itemId)
            } catch (error) {
                console.error('Error updating número de dictamen:', error)
            } finally {
                loadingService.hide()
                this.closeDetail()
            }
        },
        cleanUpCampos() {
            this.selectedTipo = null,
            this.selectedTipoNombre = '',
            this.selectedDictamen = null,
            this.stepMove = 1,
            this.modo = 1,
            //Step 2
            this.numero_dictamen = '',
            this.fecha_inspeccion = '',
            this.codigo_expediente = '',
            this.codVerif = '',
            //Step 3
            this.propietario_instalacion = '',
            this.nro_documento = '',
            this.departamento = '',
            this.municipio = '',
            this.direccion = '',
            this.barrio = '',
            //Step 4
            this.tipo_construccion = null
            this.localizacion = '',
            this.tension = '',
            this.capacidad = '',
            this.zona = null,
            this.servicio = null,
            this.uso = null,
            this.tipoConfiguracion = null,
            this.longitud = '',
            this.tipoConductores = '',
            this.materialEstructuras = '',
            this.nroEstructurasApoyo = '',
            this.nro_transformadores = '',
            this.tipo_proceso_asoc = null,
            this.tipo_subestacion = null,
            this.tipo_instalacion = null,
            this.tipo_uso_final = null,
            this.subtipoInstalacion = '',
            this.selectedFase = null,
            //Step 5
            this.arrayDisenador = [
                {
                    id: 1,
                    tipoProf: 'Diseñador',
                    nombre: '',
                    Profesion: '',
                    matriculaProf: ''
                },
            ],
            this.arrayConstructor = [
                {
                    id: 1,
                    tipoProf: 'Constructor',
                    nombre: '',
                    Profesion: '',
                    matriculaProf: ''
                },
            ],
            this.arrayOperador = [
                {
                    id: 1,
                    tipoProf: 'Operador',
                    nombre: '',
                    Profesion: '',
                    matriculaProf: ''
                },
            ],
            this.arrayInterventor = [
                {
                    id: 1,
                    tipoProf: 'Interventor',
                    nombre: '',
                    Profesion: '',
                    matriculaProf: ''
                },
            ],
            //Step 6
            this.evaluaciones = [],
            //Step 7
            this.selectedResultadoValue = null,
            this.selectedResultadoId = null,
            this.observaciones = '',
            this.modificaciones = '',
            this.advertenciasEsp = '',
            this.anexos = ''
            //Step 8
            this.nombre_dt = '',
            this.nroDcto_dt = '',
            this.profesion_dt = '',
            this.certComp_dt = '',
            this.matrProf_dt = '',
            this.nombre_insp = '',
            this.nroDcto_insp = '',
            this.profesion_insp = '',
            this.certComp_insp = '',
            this.matrProf_insp = ''
        },
        onAplicaChange(item) {
            if (item.aplica === false) {
                item.parametroMedido = 'NA'
                item.parametroReferencia = 'NA'
                item.cumple = null
            } else {
                item.parametroMedido = ''
                item.parametroReferencia = ''
                item.cumple = null
            }
        },
        async downloadDictamenPDF(tipo,dictamenId, tipoDictamen) {
            this.loadingPDF = true
            const rutaPDF = process.env.VUE_APP_API_URL + `/pdf/${tipo}/${dictamenId}/${tipoDictamen}`
            window.open(
                `${rutaPDF}`,
                '_blank'
            );
            this.loadingPDF = false
        },
        validaciones() {
            if (this.stepMove === 1 && !this.selectedTipo) {
                snackbarService.show('Por favor, seleccione un tipo de dictamen.', 'error')
                return false
            } else if (this.stepMove === 2) {
                if (!this.fecha_inspeccion) {
                    snackbarService.show('Por favor, ingrese la fecha de inspección.', 'error')
                    return false
                }
                if (!this.codigo_expediente) {
                    snackbarService.show('Por favor, ingrese el código de expediente.', 'error')
                    return false
                }
            } else if (this.stepMove === 3) {
                if (!this.propietario_instalacion) {
                    snackbarService.show('Por favor, ingrese el nombre del propietario de la instalación.', 'error')
                    return false
                }
                if (!this.nro_documento) {
                    snackbarService.show('Por favor, ingrese el número de documento del propietario.', 'error')
                    return false
                }
                if (!this.departamento) {
                    snackbarService.show('Por favor, seleccione un departamento.', 'error')
                    return false
                }
                if (!this.municipio) {
                    snackbarService.show('Por favor, seleccione un municipio.', 'error')
                    return false
                }
                if (!this.direccion) {
                    snackbarService.show('Por favor, ingrese la dirección.', 'error')
                    return false
                }
                if (!this.barrio) {
                    snackbarService.show('Por favor, ingrese el barrio.', 'error')
                    return false
                }
            } else if (this.stepMove === 4) {
                if (this.tipo_construccion === '') {
                    snackbarService.show('Por favor, seleccione un tipo de construcción.', 'error')
                    return false
                }
                if (this.localizacion === '' && this.selectedTipo === 1) {
                    snackbarService.show('Por favor, ingrese la localización.', 'error')
                    return false
                }
                if (this.tension === '') {
                    snackbarService.show('Por favor, ingrese la tensión.', 'error')
                    return false
                }
                if (this.capacidad === '') {
                    snackbarService.show('Por favor, ingrese la capacidad.', 'error')
                    return false
                }
                if (this.zona === '' && (this.selectedTipo === 1 || this.selectedTipo === 3)) {
                    snackbarService.show('Por favor, seleccione una zona.', 'error')
                    return false
                }
                if (this.servicio === '' && (this.selectedTipo === 1 || this.selectedTipo === 3)) {
                    snackbarService.show('Por favor, seleccione un servicio.', 'error')
                    return false
                }
                if (this.uso === '' && this.selectedTipo === 1) {
                    snackbarService.show('Por favor, seleccione un uso.', 'error')
                    return false
                }
                if (this.tipoConfiguracion === '' && this.selectedTipo === 1) {
                    snackbarService.show('Por favor, seleccione un tipo de configuración.', 'error')
                    return false
                }
                if (this.longitud === '' && this.selectedTipo === 1) {
                    snackbarService.show('Por favor, ingrese la longitud.', 'error')
                    return false
                }
                if (this.tipoConductores === '' && this.selectedTipo === 1) {
                    snackbarService.show('Por favor, ingrese el tipo de conductores.', 'error')
                    return false
                }
                if (this.materialEstructuras === '' && this.selectedTipo === 1) {
                    snackbarService.show('Por favor, ingrese el material de las estructuras.', 'error')
                    return false
                }
                if (this.nroEstructurasApoyo === '' && this.selectedTipo === 1) {
                    snackbarService.show('Por favor, ingrese el número de estructuras de apoyo.', 'error')
                    return false
                }
                if (this.tipo_proceso_asoc === '' && this.selectedTipo === 2) {
                    snackbarService.show('Por favor, seleccione un tipo de proceso asociado.', 'error')
                    return false
                }
                if (this.tipo_subestacion === '' && this.selectedTipo === 2) {
                    snackbarService.show('Por favor, seleccione un tipo de subestación.', 'error')
                    return false
                }
                if (this.tipo_instalacion === '' && this.selectedTipo === 2) {
                    snackbarService.show('Por favor, seleccione un tipo de instalación.', 'error')
                    return false
                }   
                if (this.nro_transformadores === '' && this.selectedTipo === 2) {
                    snackbarService.show('Por favor, ingrese el número de transformadores.', 'error')
                    return false
                }
                if (this.tipo_uso_final === '' && this.selectedTipo === 3) {
                    snackbarService.show('Por favor, seleccione un tipo de uso final.', 'error')
                    return false
                }
                if (this.subtipoInstalacion === '' && this.selectedTipo === 3) {
                    snackbarService.show('Por favor, ingrese el subtipo de instalación.', 'error')
                    return false
                }
                if (this.selectedFase === null && this.selectedTipo === 3) {
                    snackbarService.show('Por favor, seleccione la fase.', 'error')
                    return false
                }
            } else if (this.stepMove === 5) {
                const profesionalesIncompletos = [
                    ...this.arrayDisenador,
                    ...this.arrayConstructor,
                    ...this.arrayOperador,
                    ...this.arrayInterventor
                ].some(prof => !prof.nombre || !prof.Profesion || !prof.matriculaProf)

                if (profesionalesIncompletos) {
                    snackbarService.show('Por favor, complete todos los campos de los profesionales.', 'error')
                    return false
                }
            } else if (this.stepMove === 6) {
                const evaluacionesIncompletas = this.evaluaciones.some(item => item.aplica === null)
                if (evaluacionesIncompletas) {
                    snackbarService.show('Por favor, complete todas las evaluaciones.', 'error')
                    return false
                }
            } else if (this.stepMove === 7) {
                if (this.selectedResultadoValue === null) {
                    snackbarService.show('Por favor, seleccione un resultado de inspección.', 'error')
                    return false
                }
            } else if (this.stepMove === 8) {
                if (!this.nombre_dt) {
                    snackbarService.show('Por favor, ingrese el nombre del director técnico.', 'error')
                    return false
                }
                if (!this.nroDcto_dt) {
                    snackbarService.show('Por favor, ingrese el número de documento del director técnico.', 'error')
                    return false
                }
                if (!this.profesion_dt) {
                    snackbarService.show('Por favor, ingrese la profesión del director técnico.', 'error')
                    return false
                }
                if (!this.certComp_dt) {
                    snackbarService.show('Por favor, ingrese el certificado de competencias del director técnico.', 'error')
                    return false
                }
                if (!this.matrProf_dt) {
                    snackbarService.show('Por favor, ingrese la matrícula profesional del director técnico.', 'error')
                    return false
                }
                if (!this.nombre_insp) {
                    snackbarService.show('Por favor, ingrese el nombre del inspector.', 'error')
                    return false
                }
                if (!this.nroDcto_insp) {
                    snackbarService.show('Por favor, ingrese el número de documento del inspector.', 'error')
                    return false
                }
                if (!this.profesion_insp) {
                    snackbarService.show('Por favor, ingrese la profesión del inspector.', 'error')
                    return false
                }
                if (!this.certComp_insp) {
                    snackbarService.show('Por favor, ingrese el certificado de competencias del inspector.', 'error')
                    return false
                }
                if (!this.matrProf_insp) {
                    snackbarService.show('Por favor, ingrese la matrícula profesional del inspector.', 'error')
                    return false
                }
            }
            return true
        },
        async updateNroDictamen(numeroDictamen) {
            try {
                loadingService.show('Actualizando número de dictamen...')
                const id = numeroDictamen.split('-')[0]
                const numeracion = numeroDictamen.split('-')[1]
                await dictamenService.updateNroDictamen({
                    id: id,
                    numeracion: numeracion
                })
            } catch (error) {
                console.error('Error updating número de dictamen:', error)
            } finally {
                loadingService.hide()
            }
        },
        async getDictamenById(dictamenId) {
            try {
                loadingService.show('Cargando dictamen...')
                const dictamen = await dictamenService.getDictamenById(dictamenId)
                this.dictamenDetail = dictamen
            } catch (error) {
                console.error('Error fetching dictamen:', error)
            } finally {
                loadingService.hide()
                this.getMunicipiosByDepto(this.dictamenDetail.dictamen.datosGenerales.municipio.CODIGODEPTO)
            }
        },
        asignaVariablesDetailShow() {
            this.numero_dictamen = this.dictamenDetail.dictamen.nroDictamen
            this.selectedTipo = this.dictamenDetail.dictamen.tipoDictamen
            this.fecha_expedicion = this.dictamenDetail.dictamen.fechaExpedicion
            this.fecha_inspeccion = this.dictamenDetail.dictamen.fechaInspeccion
            this.codigo_expediente = this.dictamenDetail.dictamen.codExpediente
            this.codVerif = this.dictamenDetail.dictamen.codVerif
            //Datos Generales
            this.nro_documento = this.dictamenDetail.dictamen.datosGenerales.docProp
            this.propietario_instalacion = this.dictamenDetail.dictamen.datosGenerales.nombreProp
            this.departamento = this.dictamenDetail.dictamen.datosGenerales.municipio.CODIGODEPTO
            this.municipio = this.dictamenDetail.dictamen.datosGenerales.municipio.CODIGO
            this.direccion = this.dictamenDetail.dictamen.datosGenerales.address
            this.barrio = this.dictamenDetail.dictamen.datosGenerales.barrio
            //Dictamen Parte C
            this.tipo_construccion = this.dictamenDetail.parteC.tipoConstruccion
            this.localizacion = this.dictamenDetail.parteC.localizacion
            this.tension = this.dictamenDetail.parteC.tension
            this.capacidad = this.dictamenDetail.parteC.capacidad
            this.zona = this.dictamenDetail.parteC.zona
            this.servicio = this.dictamenDetail.parteC.servicio
            this.uso = this.dictamenDetail.parteC.uso
            this.tipoConfiguracion = this.dictamenDetail.parteC.tipoconfiguracion
            this.longitud = this.dictamenDetail.parteC.longitud
            this.tipoConductores = this.dictamenDetail.parteC.tipoConductores
            this.materialEstructuras = this.dictamenDetail.parteC.materialEstructuras
            this.nroEstructurasApoyo = this.dictamenDetail.parteC.estructurasApoyo
            this.tipo_proceso_asoc = this.dictamenDetail.parteC.tipoProcesoAsoc
            this.tipo_subestacion = this.dictamenDetail.parteC.tipoSubestacion
            this.tipo_instalacion = this.dictamenDetail.parteC.tipoInstalacion
            this.nro_transformadores = this.dictamenDetail.parteC.nroTransformadores
            this.tipo_uso_final = this.dictamenDetail.parteC.tipoUsoFinal
            this.subtipoInstalacion = this.dictamenDetail.parteC.subtipoInstalacion
            this.selectedFase = this.dictamenDetail.parteC.fases
            //Dictamen Parte D
            this.arrayDisenador = [],
            this.arrayConstructor = [],
            this.arrayOperador = [],
            this.arrayInterventor = [],
            this.asignarProfesionalesDetailShow()
            //Dictamen Parte E
            this.asignarEvaluacionesDetailShow()
            //Dictamen Parte F
            this.selectedResultadoValue = this.dictamenDetail.parteF.resultado
            this.selectedResultadoId = this.selectedResultadoValue ? 1 : 2
            this.observaciones = this.dictamenDetail.parteF.observaciones
            this.modificaciones = this.dictamenDetail.parteF.modificaciones
            this.advertenciasEsp = this.dictamenDetail.parteF.advertenciasEsp
            this.anexos = this.dictamenDetail.parteF.anexos
            //Dictamen Parte H
            this.nombre_dt = this.dictamenDetail.parteH.nombre_dt
            this.nroDcto_dt = this.dictamenDetail.parteH.nroDcto_dt
            this.profesion_dt = this.dictamenDetail.parteH.profesion_dt
            this.certComp_dt = this.dictamenDetail.parteH.certComp_dt
            this.matrProf_dt = this.dictamenDetail.parteH.matrProf_dt
            this.nombre_insp = this.dictamenDetail.parteH.nombre_insp
            this.nroDcto_insp = this.dictamenDetail.parteH.nroDcto_insp
            this.profesion_insp = this.dictamenDetail.parteH.profesion_insp
            this.certComp_insp = this.dictamenDetail.parteH.certComp_insp
            this.matrProf_insp = this.dictamenDetail.parteH.matrProf_insp
        },
        async openDetailShow(item) {
            let dictamenId = item ? item.id : null
            this.selectedDictamen = dictamenId
            await this.getDictamenById(item.id)
            this.asignaVariablesDetailShow()
            this.openDetail(1)
        },
        async openDetailEdit(item) {
            let dictamenId = item ? item.id : null
            this.selectedDictamen = dictamenId
            await this.getDictamenById(item.id)
            this.asignaVariablesDetailShow()
            this.openDetail(2)
        },
        asignarProfesionalesDetailShow() {
            this.dictamenDetail.parteD.map(prof => {
                const profData = {
                    id: prof.id,
                    tipoProf: prof.tipoProf,
                    nombre: prof.nombre,
                    Profesion: prof.Profesion,
                    matriculaProf: prof.matriculaProf
                }
                if (prof.tipoProf === 'Diseñador') {
                    this.arrayDisenador.push(profData)
                } else if (prof.tipoProf === 'Constructor') {
                    this.arrayConstructor.push(profData)
                } else if (prof.tipoProf === 'Operador') {
                    this.arrayOperador.push(profData)
                } else if (prof.tipoProf === 'Interventor') {
                    this.arrayInterventor.push(profData)
                }
            })
        },
        async asignarEvaluacionesDetailShow() {
            const evaluacionesConParteE = this.dictamenDetail.parteE.map(ev => {
                const evalData = {
                    id: ev.evaluacion.id,
                    grupo: ev.evaluacion.grupo,
                    nombre: ev.evaluacion.nombre,
                    aplica: ev.aplica,
                    parametroMedido: ev.parametroMedido,
                    parametroReferencia: ev.parametroRef,
                    cumple: ev.cumple
                }
                return evalData;
            });

            this.evaluaciones = evaluacionesConParteE;
        }
    },
    computed: {
        permisoCreacion() {
            return hasRole('ADMIN', 'GESTOR');
        },
        groupedItems() {
            return this.evaluaciones.reduce((acc, item) => {
                if (!acc[item.grupo]) {
                    acc[item.grupo] = []
                }
                acc[item.grupo].push(item)
                return acc
            }, {})
        },
        nroAnexo() {
            return this.selectedTipo != null ? this.selectedTipo + 2 : 2
        }
    }
}
</script>
<style>
    .bordered-title {
        border: 1px solid #FFA500;
        border-radius: 4px;
    }

    .selectable-card {
        cursor: pointer;
        transition: all 0.25s ease;
    }

    .selectable-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }
    .selected-card {
        border: 2px solid #FFA500 !important;
        border-radius: 8px;
        background-color: #333333 !important;
        color: white !important;
    }

    .selected-subtitle {
        color: #FFFFFF !important;
    }

    .selected-icon {
        color: #FFFFFF !important;
    }

    .selected-card-result-true {
        border: 4px solid #2eac34 !important;
        border-radius: 8px;
        background-color: #98df9b !important;
        color: white !important;
    }

    .selected-card-result-false {
        border: 2px solid #e22a12 !important;
        border-radius: 8px;
        background-color: #e25757 !important;
        color: white !important;
    }

    .selected-card-icon-result-true {
        color: #2eac34 !important;
    }

    .selected-card-icon-result-false {
        color: #e22a12 !important;
    }

    .dictamen-card {
        border-radius: 16px;
        padding: 20px;
    }

    .dictamen-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 16px;
    }

    .section-card {
        border-radius: 16px;
        padding: 18px 18px 20px 18px;
    }

    .section-header {
        display: flex;
        align-items: flex-start;
    }
</style>