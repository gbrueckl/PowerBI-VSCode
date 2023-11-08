namespace TMDLVSCodeConsoleProxy
{
    public static class Config
    {
        public static string secret = "";        
        public static int port = 0;

        public static void validateHeader(ProxyHeader header)
        {
            if (header == null)
            {
                throw new Exception("No Header or Authentication provided!");
            }

            if (!header.secret.Equals(Config.secret))
            {
                throw new Exception("Invalid Secret!");
            }
        }
    }
}