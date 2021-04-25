//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/menu/importExport.vue.js

var components = components || {};

components.importExport = {
	template: `
	<div style="height:100%;width:calc(100% - 5px);">
		<textarea style="width: 100%; height: calc(100% - 30px); white-space: nowrap; background-color: rgb(255, 255, 255);">{{sample}}</textarea>
		<input type="button" value="Import" id="import" style="margin-right:10px;">
		<input type="button" value="Export" id="export">
	</div>
	`,
	computed: {
		sample()
		{
			return 'asdf';
		}
	}
};
