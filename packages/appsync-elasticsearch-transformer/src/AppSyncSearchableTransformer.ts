import { Transformer, TransformerContext } from "graphql-transform";
import {
    DirectiveNode,
    ObjectTypeDefinitionNode,
    FieldDefinitionNode
} from "graphql";
import { ResourceFactory } from "./resources";
import { makeStaticFields, makeSearchInputObject } from "./definitions";
import {
    makeNamedType,
    blankObjectExtension,
    makeArg,
    makeField,
    makeNonNullType,
    extensionWithFields
} from "appsync-transformer-common";

/**
 * Handles the @searchable directive on OBJECT types.
 */
export class AppSyncSearchableTransformer extends Transformer {
    resources: ResourceFactory;

    constructor() {
        super("AppSyncSearchableTransformer", "directive @searchable on OBJECT");
        this.resources = new ResourceFactory();
    }

    public before = (ctx: TransformerContext): void => {
        const template = this.resources.initTemplate();
        ctx.mergeResources(template.Resources);
        ctx.mergeParameters(template.Parameters);
        ctx.mergeOutputs(template.Outputs);

        const staticInputTypes = makeStaticFields();
        for (const i in staticInputTypes) {
            if (staticInputTypes.hasOwnProperty(i)) {
                ctx.addObject(staticInputTypes[i]);
            }
        }
    };

    /**
     * Given the initial input and context manipulate the context to handle this object directive.
     * @param initial The input passed to the transform.
     * @param ctx The accumulated context for the transform.
     */
    public object = (
        def: ObjectTypeDefinitionNode,
        directive: DirectiveNode,
        ctx: TransformerContext
    ): void => {
        // Create the connection object type.
        const connection = makeSearchInputObject(def);
        ctx.addObject(connection);
        // TODO: Add resolvers to the newly created Connection Input type.
    };
}
