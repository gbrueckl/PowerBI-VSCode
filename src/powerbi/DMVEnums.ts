export const PBIDataType: Map<number, string> = new Map<number, string>([
	[1, 'Automatic'], // Internal only.
	[17, 'Binary'], // Column or measure contains binary data.
	[11, 'Boolean'], // Column or measure contains boolean data values.
	[9, 'DateTime'], // Column or measure contains date and time data
	[10, 'Decimal'], // Column or measure contains decimal data values.
	[8, 'Double'], // Column or measure contains double-precision floating-point numbers.
	[6, 'Int64'], // Column or measure contains integers.
	[2, 'String'], // Column or measure contains string data values.
	[19, 'Unknown'], // Initial value of a newly created column, replaced with an actual value after saving a Column to the Server.
	[20, 'Variant'] // A measure with varying data type.
]);


export const PBISummarizeBy: Map<number, string> = new Map<number, string>([
	[2, 'Count'], // Count type aggregation.
	[0, 'GroupBy'], // GroupBy type aggregation.
	[4, 'Max'], // Max type aggregation.
	[3, 'Min'], // Min type aggregation.
	[1, 'Sum'] // Sum type aggregation.
]);

export const PBIObjectState: Map<number, string> = new Map<number, string>([
	[4, 'CalculationNeeded'], // Object is not queryable and contains no data. It needs to be refreshed to become functional. Applies only to calculated objects, such as calculated columns, hierarchies, and calculated tables.
	[7, 'DependencyError'], // Object is in an error state because some of its calculation dependencies are in an error state. It is not queryable.
	[6, 'EvaluationError'], // Object is in an error state because an error occurred during expression evaluation. It is not queryable.
	[10, 'ForceCalculationNeeded'], // The data is possibly outdated, but is in a queryable state. Applies only for CalculatedTable.
	[8, 'Incomplete'], // Some parts of the object have no data. Refresh the object to add the rest of the data. The object is queryable. Applies to non-calculated objects, such as DataColumns, partitions, and tables.
	[3, 'NoData'], // Object is queryable but contains no data. Refresh it to bring in data. Applies to non-calculated objects, such as DataColumns, partitions, and Tables.
	[1, 'Ready'], // Object is refreshed, contains up-to-date data, and is queryable.
	[5, 'SemanticError'], // Object is in an error state because of an invalid expression. It is not queryable.
	[19, 'Unknown'], // Initial value of a newly created column, replaced with an actual value after saving a Column to the Server.
	[20, 'Variant'] // A measure with varying data type.
]);

export const PBIStorageModeType: Map<number, string> = new Map<number, string>([
	[2, 'Default'], // Only partitions can use this value. When set, the partition will inherit the DefaultMode of the Model.
	[5, 'DirectLake'], // Data will be loaded into memory from the data lake or queried dynamically if DirectLake fallback is enabled.
	[1, 'DirectQuery'], // Data will be queried dynamically from a data source.
	[4, 'Dual'], // Uses both Import and DirectQuery storage modes to support queries in composite models with high performance.
	[0, 'Import'], // Data will be imported from a data source.
	[3, 'Push'] // Do not reference this member directly in your code. It supports the Analysis Services infrastructure.
]);
