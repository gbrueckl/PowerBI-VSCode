import * as vscode from 'vscode';
import { FABRIC_SCHEME } from '../filesystemProvider/fabric/FabricFileSystemProvider';
import { FabricFSUri, FabricUriType } from '../filesystemProvider/fabric/FabricFSUri';
import { FabricFSItem } from '../filesystemProvider/fabric/FabricFSItem';


export class FabricFileDecorationProvider implements vscode.FileDecorationProvider {
	private static _addedUris: string[] = [];
	private static _modifiedUris: string[] = [];
	private static _deletedUris: string[] = [];
	public static provider: FabricFileDecorationProvider;

	protected _onDidChangeFileDecorations = new vscode.EventEmitter<vscode.Uri[]>();
	readonly onDidChangeFileDecorations = this._onDidChangeFileDecorations.event;

	public static async register(context: vscode.ExtensionContext) {
		const fdp = new FabricFileDecorationProvider()
		context.subscriptions.push(vscode.window.registerFileDecorationProvider(fdp));

		FabricFileDecorationProvider.provider = fdp;
	}

	public static async uriAdded(fabricUri: FabricFSUri): Promise<void> {
		if (!FabricFileDecorationProvider._addedUris.includes(fabricUri.uniqueKey)) {
			FabricFileDecorationProvider._addedUris.push(fabricUri.uniqueKey);
		}

		FabricFileDecorationProvider.provider._onDidChangeFileDecorations.fire([fabricUri.uri]);
	}

	public static async uriModifed(fabricUri: FabricFSUri): Promise<void> {
		if (!FabricFileDecorationProvider._modifiedUris.includes(fabricUri.uniqueKey)) {
			FabricFileDecorationProvider._modifiedUris.push(fabricUri.uniqueKey);
		}

		FabricFileDecorationProvider.provider._onDidChangeFileDecorations.fire([fabricUri.uri]);
	}

	public static async uriDeleted(fabricUri: FabricFSUri): Promise<void> {
		if (!FabricFileDecorationProvider._deletedUris.includes(fabricUri.uniqueKey)) {
			FabricFileDecorationProvider._deletedUris.push(fabricUri.uniqueKey);
		}

		FabricFileDecorationProvider.provider._onDidChangeFileDecorations.fire([fabricUri.uri]);
	}

	public static async uriPublished(fabricUri: FabricFSUri): Promise<boolean> {
		let ret: boolean = false;
		let index: number = undefined;

		index = FabricFileDecorationProvider._modifiedUris.indexOf(fabricUri.uniqueKey, 0);
		if (index > -1) {
			FabricFileDecorationProvider._modifiedUris.splice(index, 1);
			ret = true;
		}

		index = FabricFileDecorationProvider._addedUris.indexOf(fabricUri.uniqueKey, 0);
		if (index > -1) {
			FabricFileDecorationProvider._addedUris.splice(index, 1);
			ret = true;
		}

		index = FabricFileDecorationProvider._deletedUris.indexOf(fabricUri.uniqueKey, 0);
		if (index > -1) {
			FabricFileDecorationProvider._deletedUris.splice(index, 1);
			ret = true;
		}

		if(ret)
		{
			FabricFileDecorationProvider.provider._onDidChangeFileDecorations.fire([fabricUri.uri]);
		}
		return ret;
	}

	public provideFileDecoration(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<vscode.FileDecoration> {
		if (uri.scheme !== FABRIC_SCHEME) {
			return undefined;
		}

		const fabricUri: FabricFSUri = new FabricFSUri(uri);

		if (!fabricUri.isValid) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}

		if (fabricUri.uriType === FabricUriType.item && FabricFileDecorationProvider._addedUris.includes(fabricUri.uniqueKey)) {
			const item = fabricUri.getCacheItemSync<FabricFSItem>();
			return new vscode.FileDecoration("A", "Added", new vscode.ThemeColor("gitDecoration.addedResourceForeground"));
		}
		if (fabricUri.uriType === FabricUriType.item && FabricFileDecorationProvider._deletedUris.includes(fabricUri.uniqueKey)) {
			const item = fabricUri.getCacheItemSync<FabricFSItem>();
			return new vscode.FileDecoration("D", "Deleted", new vscode.ThemeColor("gitDecoration.deletedResourceForeground"));
		}
		if (fabricUri.uriType === FabricUriType.item && FabricFileDecorationProvider._modifiedUris.includes(fabricUri.uniqueKey)) {
			const item = fabricUri.getCacheItemSync<FabricFSItem>();
			return new vscode.FileDecoration("U", "Unpublished", new vscode.ThemeColor("gitDecoration.modifiedResourceForeground"));
		}
		return undefined;
	}
}
