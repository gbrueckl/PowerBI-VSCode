import * as vscode from 'vscode';
import { FABRIC_SCHEME } from '../filesystemProvider/fabric/FabricFileSystemProvider';
import { FabricFSUri, FabricUriType } from '../filesystemProvider/fabric/FabricFSUri';
import { FabricFSItem } from '../filesystemProvider/fabric/FabricFSItem';
import { FabricFSPublishAction } from '../filesystemProvider/fabric/_types';


export class FabricFileDecorationProvider implements vscode.FileDecorationProvider {
	private static _decoratedUris: Map<string, FabricFSPublishAction> = new Map<string, FabricFSPublishAction>();
	public static provider: FabricFileDecorationProvider;

	protected _onDidChangeFileDecorations = new vscode.EventEmitter<vscode.Uri[]>();
	readonly onDidChangeFileDecorations = this._onDidChangeFileDecorations.event;

	public static async register(context: vscode.ExtensionContext) {
		const fdp = new FabricFileDecorationProvider()
		context.subscriptions.push(vscode.window.registerFileDecorationProvider(fdp));

		FabricFileDecorationProvider.provider = fdp;
		FabricFileDecorationProvider._decoratedUris = new Map<string, FabricFSPublishAction>();
	}

	public static async uriAdded(fabricUri: FabricFSUri): Promise<void> {
		this._decoratedUris.set(fabricUri.uniqueKey, FabricFSPublishAction.CREATE);

		FabricFileDecorationProvider.provider._onDidChangeFileDecorations.fire([fabricUri.uri]);
	}

	public static async uriModifed(fabricUri: FabricFSUri): Promise<void> {
		this._decoratedUris.set(fabricUri.uniqueKey, FabricFSPublishAction.UPDATE);

		FabricFileDecorationProvider.provider._onDidChangeFileDecorations.fire([fabricUri.uri]);
	}

	public static async uriDeleted(fabricUri: FabricFSUri): Promise<void> {
		this._decoratedUris.set(fabricUri.uniqueKey, FabricFSPublishAction.DELETE);

		FabricFileDecorationProvider.provider._onDidChangeFileDecorations.fire([fabricUri.uri]);
	}

	public static async uriPublished(fabricUri: FabricFSUri): Promise<boolean> {
		let ret: boolean = false;
		let index: number = undefined;

		ret = this._decoratedUris.delete(fabricUri.uniqueKey);

		if (ret) {
			FabricFileDecorationProvider.provider._onDidChangeFileDecorations.fire([fabricUri.uri]);
		}
		return ret;
	}

	public static async uriReloaded(fabricUri: FabricFSUri): Promise<void> {
		let reloadedUris: vscode.Uri[] = [];

		for (let [key, action] of FabricFileDecorationProvider._decoratedUris.entries()) {
			if (key.startsWith(fabricUri.uniqueKey)) {
				FabricFileDecorationProvider._decoratedUris.delete(key)
				reloadedUris.push(vscode.Uri.parse(key));
			}
		}

		FabricFileDecorationProvider.provider._onDidChangeFileDecorations.fire(reloadedUris);
	}

	public provideFileDecoration(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<vscode.FileDecoration> {
		if (uri.scheme !== FABRIC_SCHEME) {
			return undefined;
		}

		const fabricUri: FabricFSUri = new FabricFSUri(uri);

		if (!fabricUri.isValid) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}

		if (fabricUri.uriType === FabricUriType.item) {
			const item = FabricFileDecorationProvider._decoratedUris.get(fabricUri.uniqueKey);
			if (item != undefined) {
				switch (item) {
					case FabricFSPublishAction.CREATE:
						return new vscode.FileDecoration("A", "Added", new vscode.ThemeColor("gitDecoration.addedResourceForeground"));
					case FabricFSPublishAction.UPDATE:
						return new vscode.FileDecoration("U", "Unpublished", new vscode.ThemeColor("gitDecoration.modifiedResourceForeground"));
					case FabricFSPublishAction.DELETE:
						return new vscode.FileDecoration("D", "Deleted", new vscode.ThemeColor("gitDecoration.deletedResourceForeground"));
				}
			}
		}
		return undefined;
	}
}
