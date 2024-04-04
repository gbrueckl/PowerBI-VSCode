import * as vscode from 'vscode';
import { FABRIC_SCHEME } from '../filesystemProvider/fabric/FabricFileSystemProvider';
import { FabricFSUri, FabricUriType } from '../filesystemProvider/fabric/FabricFSUri';
import { FabricFSItem } from '../filesystemProvider/fabric/FabricFSItem';
import { FabricFSPublishAction } from '../filesystemProvider/fabric/_types';
import { FabricFSCache } from '../filesystemProvider/fabric/FabricFSCache';


export class FabricFSFileDecorationProvider implements vscode.FileDecorationProvider {
	private static provider: FabricFSFileDecorationProvider;

	protected _onDidChangeFileDecorations = new vscode.EventEmitter<vscode.Uri[]>();
	readonly onDidChangeFileDecorations = this._onDidChangeFileDecorations.event;

	public static async register(context: vscode.ExtensionContext) {
		const fdp = new FabricFSFileDecorationProvider()
		context.subscriptions.push(vscode.window.registerFileDecorationProvider(fdp));

		FabricFSFileDecorationProvider.provider = fdp;
	}

	public static updateFileDecoration(urisToUpdate: vscode.Uri[]) {
		this.provider._onDidChangeFileDecorations.fire(urisToUpdate);
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
			const item = FabricFSCache.getLocalChanges(fabricUri);
			if (item != undefined) {
				let fileDeco: vscode.FileDecoration;
				switch (item) {
					case FabricFSPublishAction.CREATE:
						fileDeco = new vscode.FileDecoration("A", "Added", new vscode.ThemeColor("gitDecoration.addedResourceForeground"));
						break;
					case FabricFSPublishAction.MODIFIED:
						fileDeco = new vscode.FileDecoration("M", "Modified", new vscode.ThemeColor("gitDecoration.modifiedResourceForeground"));
						break;
					case FabricFSPublishAction.DELETE:
						fileDeco = new vscode.FileDecoration("D", "Deleted", new vscode.ThemeColor("gitDecoration.deletedResourceForeground"));
						break;
					default:
						vscode.window.showErrorMessage(`Unknown publish action: '${item}'`);
						return undefined;
				}
				fileDeco.propagate = true;
				return fileDeco
			}
		}
		return undefined;
	}
}
