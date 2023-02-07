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

	static getNotebookKernelName(entryPoint: string): string {
		return entryPoint + PowerBIKernelManager.NotebookKernelSuffix;
	}

	static getNotebookKernel(entryPoint: string): PowerBIKernel {
		return this.getKernel(this.getNotebookKernelName(entryPoint));
	}

	static notebookKernelExists(entryPoint: string): boolean {
		if (this.getKernel(this.getNotebookKernelName(entryPoint))) {
			return true;
		}
		return false;
	}

	static getInteractiveKernelName(entryPoint: string): string {
		return entryPoint + PowerBIKernelManager.InteractiveKernelSuffix
	}

	static getInteractiveKernel(entryPoint: string): PowerBIKernel {
		return this.getKernel(this.getInteractiveKernelName(entryPoint));
	}

	static interactiveKernelExists(entryPoint: string): boolean {
		if (this.getInteractiveKernel(entryPoint)) {
			return true;
		}
		return false;
	}

	static async createKernels(entryPoint: string, logMessages: boolean = true): Promise<void> {
		if (!this.notebookKernelExists(entryPoint)) {
			let notebookKernel: PowerBIKernel = new PowerBIKernel(entryPoint, 'jupyter-notebook');
			this.setKernel(this.getNotebookKernelName(entryPoint), notebookKernel);
			if (logMessages) {
				ThisExtension.log(`Notebook Kernel for API path '${entryPoint}' created!`)
			}
		}
		else {
			if (logMessages) {
				ThisExtension.log(`Notebook Kernel for API path '${entryPoint}' already exists!`)
			}
		}

		if (!this.interactiveKernelExists(entryPoint)) {
			let interactiveKernel: PowerBIKernel = new PowerBIKernel(entryPoint, "interactive");
			this.setKernel(this.getInteractiveKernelName(entryPoint), interactiveKernel);
			if (logMessages) {
				ThisExtension.log(`Interactive Kernel for API path '${entryPoint}' created!`)
			}
		}
		else {
			if (logMessages) {
				ThisExtension.log(`Interactive Kernel for API path '${entryPoint}' already exists!`)
			}
		}
	}

	static async removeKernels(entryPoint, logMessages: boolean = true): Promise<void> {
		if (this.notebookKernelExists(entryPoint)) {
			this.removeKernel(this.getNotebookKernelName(entryPoint));
			if (logMessages) {
				ThisExtension.log(`Notebook Kernel for API path '${entryPoint}' removed!`)
			}
		}
		else {
			if (logMessages) {
				ThisExtension.log(`Notebook Kernel for API path '${entryPoint}' does not exists!`)
			}
		}

		if (this.interactiveKernelExists(entryPoint)) {
			this.removeKernel(this.getInteractiveKernelName(entryPoint));
			if (logMessages) {
				ThisExtension.log(`Interactive Kernel for API path '${entryPoint}' removed!`)
			}
		}
		else {
			if (logMessages) {
				ThisExtension.log(`Interactive Kernel for API path '${entryPoint}' does not exists!`)
			}
		}
	}
}