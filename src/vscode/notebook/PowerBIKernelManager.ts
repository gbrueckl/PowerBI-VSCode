import * as vscode from 'vscode';
import { iPowerBIDataset } from '../../powerbi/DatasetsAPI/_types';

import { ThisExtension } from '../../ThisExtension';
import { PowerBIDataset } from '../treeviews/workspaces/PowerBIDataset';
import { PowerBIKernel } from './PowerBIKernel';


export abstract class PowerBIKernelManager {
	private static NotebookKernelSuffix: string = "-jupyter-notebook";
	private static InteractiveKernelSuffix: string = "-interactive";

	private static _kernels: Map<string, PowerBIKernel> = new Map<string, PowerBIKernel>();

	static async initialize(): Promise<void> {
		this.refresh();
	}

	static async refresh(showInfoMessage: boolean = false): Promise<void> {
		
	}

	static setKernel(kernelName: string, kernel: PowerBIKernel): void {
		if (!this._kernels.has(kernelName)) {
			this._kernels.set(kernelName, kernel);
		}
	}

	static removeKernel(kernelName: string): void {
		if (this._kernels.has(kernelName)) {
			let kernel: PowerBIKernel = this.getKernel(kernelName);
			kernel.dispose();
		}
	}

	static getKernel(kernelName: string): PowerBIKernel {
		return this._kernels.get(kernelName);
	}

	static getNotebookKernelName(dataset: PowerBIDataset): string {
		return dataset.id + PowerBIKernelManager.NotebookKernelSuffix;
	}

	static getNotebookKernel(dataset: PowerBIDataset): PowerBIKernel {
		return this.getKernel(this.getNotebookKernelName(dataset));
	}

	static notebookKernelExists(dataset: PowerBIDataset): boolean {
		if (this.getKernel(this.getNotebookKernelName(dataset))) {
			return true;
		}
		return false;
	}

	static getInteractiveKernelName(dataset: PowerBIDataset): string {
		return dataset.id + PowerBIKernelManager.InteractiveKernelSuffix
	}

	static getInteractiveKernel(dataset: PowerBIDataset): PowerBIKernel {
		return this.getKernel(this.getInteractiveKernelName(dataset));
	}

	static interactiveKernelExists(dataset: PowerBIDataset): boolean {
		if (this.getInteractiveKernel(dataset)) {
			return true;
		}
		return false;
	}

	static async createKernels(dataset: PowerBIDataset, logMessages: boolean = true): Promise<void> {
		if (!this.notebookKernelExists(dataset)) {
			let notebookKernel: PowerBIKernel = new PowerBIKernel(dataset, 'jupyter-notebook');
			this.setKernel(this.getNotebookKernelName(dataset), notebookKernel);
			if (logMessages) {
				ThisExtension.log(`Notebook Kernel for PowerBI dataset '${dataset.id}' created!`)
			}
		}
		else {
			if (logMessages) {
				ThisExtension.log(`Notebook Kernel for PowerBI dataset '${dataset.id}' already exists!`)
			}
		}

		if (!this.interactiveKernelExists(dataset)) {
			let interactiveKernel: PowerBIKernel = new PowerBIKernel(dataset, "interactive");
			this.setKernel(this.getInteractiveKernelName(dataset), interactiveKernel);
			if (logMessages) {
				ThisExtension.log(`Interactive Kernel for PowerBI dataset '${dataset.id}' created!`)
			}
		}
		else {
			if (logMessages) {
				ThisExtension.log(`Interactive Kernel for PowerBI dataset '${dataset.id}' already exists!`)
			}
		}
	}

	static async removeKernels(dataset: PowerBIDataset, logMessages: boolean = true): Promise<void> {
		if (this.notebookKernelExists(dataset)) {
			this.removeKernel(this.getNotebookKernelName(dataset));
			if (logMessages) {
				ThisExtension.log(`Notebook Kernel for PowerBI dataset '${dataset.id}' removed!`)
			}
		}
		else {
			if (logMessages) {
				ThisExtension.log(`Notebook Kernel for PowerBI dataset '${dataset.id}' does not exists!`)
			}
		}

		if (this.interactiveKernelExists(dataset)) {
			this.removeKernel(this.getInteractiveKernelName(dataset));
			if (logMessages) {
				ThisExtension.log(`Interactive Kernel for PowerBI dataset '${dataset.id}' removed!`)
			}
		}
		else {
			if (logMessages) {
				ThisExtension.log(`Interactive Kernel for Databricks cluster '${dataset.id}' does not exists!`)
			}
		}
	}
}