# Depósito de Evidências

## Visão Geral

Este projeto foi desenvolvido como parte do nosso Trabalho de Conclusão de Curso (TCC) para auxiliar a Polícia Civil de Sorocaba no rastreamento e gestão de evidências criminais. O sistema roda tanto na Web quanto em dispositivos móveis, razão pela qual o React Native foi escolhido para o frontend. A aplicação permite o cadastro de evidências, geração e leitura de QR Codes e atualização do status ao longo da análise pericial.

## Tecnologias

- **Frontend**: React Native (Expo), JavaScript, Tailwind CSS
- **Backend**: C# (.NET 8, ASP.NET), Entity Framework, Identity

## Funcionalidades

- **Cadastro de evidências**: Registra novas evidências no sistema.
- **Geração de QR Code**: Cada evidência recebe um QR Code único para rastreamento.
- **Leitura de QR Code**: Uso da câmera do dispositivo para leitura e identificação rápida da evidência.
- **Listagem de evidências**: Exibe todas as evidências cadastradas no sistema.
- **Atualização de status**: O status da evidência pode ser alterado conforme o andamento da análise pericial:
    - Aguardando Análise
    - Em Análise
    - Análise Finalizada

## Fluxo de Uso

1. Um policial cadastra uma nova evidência no sistema.
2. O sistema gera um QR Code que pode ser impresso e anexado à evidência.
3. Quando um perito retira a evidência para análise, ele escaneia o QR Code e atualiza o status para "Em Análise".
4. Após a análise, o perito registra seus comentários e devolve a evidência, alterando o status e finalizando a análise.

---

Desenvolvido por [Gustavo Pereira](https://github.com/duascaras) e [Matheus Branco](https://github.com/TheMBS7), como nosso TCC.

---

# Evidence Repository

## Overview

This project was developed as our undergraduate thesis (TCC) to assist the Civil Police of Sorocaba in tracking and managing criminal evidence. The system runs on both the web and mobile devices, which is why React Native was chosen for the frontend. It allows evidence registration, QR Code generation and scanning, and status updates throughout the forensic analysis process.

## Technologies

- **Frontend**: React Native (Expo), JavaScript, Tailwind CSS
- **Backend**: C# (.NET 8, ASP.NET), Entity Framework, Identity

## Features

- **Evidence registration**: Add new evidence to the system.
- **QR Code generation**: Each piece of evidence receives a unique QR Code for tracking.
- **QR Code scanning**: Uses the device camera for quick identification of evidence.
- **Evidence listing**: Displays all registered evidence.
- **Status updates**: The evidence status can be changed as the forensic analysis progresses:
    - Awaiting Analysis
    - Under Analysis
    - Analysis Completed

## Usage Flow

1. A police officer registers new evidence in the system.
2. The system generates a QR Code that can be printed and attached to the evidence.
3. When a forensic expert retrieves the evidence for analysis, they scan the QR Code and update the status to "Under Analysis."
4. After the analysis, the expert records their observations and returns the evidence, updating the status and completing the analysis.

---

Developed by [Gustavo Pereira](https://github.com/duascaras) and [Matheus Branco](https://github.com/TheMBS7) as our undergraduate thesis.

