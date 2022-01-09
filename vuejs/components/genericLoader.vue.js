//https://raw.githubusercontent.com/wilsquar3d/public/master/vuejs/components/genericLoader.vue.js

function generic_load_component( component_suffix=null )
{
    components = components || {};

    let component_name = component_suffix ? ('generic-loader-' + component_suffix) : 'generic-loader';

    components[component_name] = {
        template: `<component :is='component_type' :prop_data='data' @cascadeEmit='emitHandler' @export='exportData'></component>`,
        data: () => {
            return {
                component_type: null,
                data: null
            };
        },
        props:
        {
            prop_component: { type: String, default: undefined },
            prop_data: { type: [Number, String, Array, Object], default: undefined }
        },
        created()
        {
            this.component_type = this.getComponentType;
            this.data = this.importData();
        },
        methods:
        {
            emitHandler( name, data )
            {
                //override this method in userscripts
            },
            importData()
            {
                //override this method in userscript not using props
                return this.prop_data ? this.prop_data : [];
            },
            exportData( data )
            {
                //override this method in userscripts
                console.log( data );
            }
        },
        computed:
        {
            getComponentType()
            {
                //override this method in userscripts not using props
                return this.prop_component ? this.prop_component : '';
            }
        }
    };

    return component_name;
}
