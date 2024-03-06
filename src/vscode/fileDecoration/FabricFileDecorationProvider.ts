import * as vscode from 'vscode';
import { FABRIC_SCHEME } from '../filesystemProvider/fabric/FabricFileSystemProvider';
import { FabricFSUri, FabricUriType } from '../filesystemProvider/fabric/FabricFSUri';
import { FabricFSCache } from '../filesystemProvider/fabric/FabricFSCache';
import { FabricFSItem } from '../filesystemProvider/fabric/FabricFSItem';


export class FabricFileDecorationProvider implements vscode.FileDecorationProvider {
	private static _modifiedUris: string[] = [];
	public static provider: FabricFileDecorationProvider;

	protected _onDidChangeFileDecorations = new vscode.EventEmitter<vscode.Uri[]>();
    readonly onDidChangeFileDecorations = this._onDidChangeFileDecorations.event;

	public static async register(context: vscode.ExtensionContext) {
		const fdp = new FabricFileDecorationProvider()
		context.subscriptions.push(vscode.window.registerFileDecorationProvider(fdp));

		FabricFileDecorationProvider.provider = fdp;
	}

	public static async fileModifed(fabricUri: FabricFSUri): Promise<void> {
		if(!FabricFileDecorationProvider._modifiedUris.includes(fabricUri.uniqueKey)) {
			FabricFileDecorationProvider._modifiedUris.push(fabricUri.uniqueKey);
		}

		FabricFileDecorationProvider.provider._onDidChangeFileDecorations.fire([fabricUri.uri]);
	}

	public static async fileSaved(fabricUri: FabricFSUri): Promise<boolean> {
		const index = FabricFileDecorationProvider._modifiedUris.indexOf(fabricUri.uniqueKey, 0);
		if (index > -1) {
			FabricFileDecorationProvider._modifiedUris.splice(index, 1);

			FabricFileDecorationProvider.provider._onDidChangeFileDecorations.fire([fabricUri.uri]);

			return true;
		}
		return false;
	}

	public provideFileDecoration(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<vscode.FileDecoration> {
		if (uri.scheme !== FABRIC_SCHEME) {
			return undefined;
		}

		const fabricUri: FabricFSUri = new FabricFSUri(uri);

		if (!fabricUri.isValid) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}

		if (fabricUri.uriType === FabricUriType.item && FabricFileDecorationProvider._modifiedUris.includes(fabricUri.uniqueKey)) {
			const item = fabricUri.getCacheItemSync<FabricFSItem>();
			return new vscode.FileDecoration("U", "Unpublished", new vscode.ThemeColor("gitDecoration.modifiedResourceForeground"));
		}
		return undefined;
	}
}
